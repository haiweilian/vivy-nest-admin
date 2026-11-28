import { fileURLToPath } from 'node:url'
import { Body, Controller, Post } from '@nestjs/common'
import type { INestApplication, Provider, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { RedisModule } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule, SecurityContext, SysLoginUser, SysUser } from '@vivy-common/core'
import { Public, SecurityModule, TokenService } from '@vivy-common/security'
import type { SecurityOptions } from '@vivy-common/security'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppController } from '../src/app.controller.js'
import { AppService } from '../src/app.service.js'
import { ModelController } from '../src/modules/model/model.controller.js'
import { ModelService } from '../src/modules/model/model.service.js'

const redisUrl = process.env.AI_TEST_REDIS_URL
if (redisUrl && new URL(redisUrl).pathname !== '/15') {
  throw new Error('AI_TEST_REDIS_URL 必须指向独立测试 Redis 的 db 15')
}
const tokens: string[] = []

/** 用 system 的 TokenService 生成真实会话，不创建第二套用户或权限数据。 */
@Controller('fixture')
class SessionIssuerController {
  constructor(private tokenService: TokenService) {}

  @Post('login')
  @Public()
  async login(@Body('userName') userName = 'ai-auth-tester') {
    const loginUser = Object.assign(new SysLoginUser(), {
      sysUser: Object.assign(new SysUser(), { userId: 2, userName }),
      roles: ['common'],
      permissions: ['ai:model:list'],
      scopes: [],
    })
    const result = await this.tokenService.createToken(loginUser)
    tokens.push(result.token)
    return result
  }
}

describe.skipIf(!redisUrl)('Shared system and AI Redis sessions', () => {
  let issuer: INestApplication
  let consumer: INestApplication
  let tokenService: TokenService
  let token: string
  const modelService = { list: vi.fn(), add: vi.fn() }

  async function createApp(configPath: URL, controllers: Type[], providers: Provider[] = []) {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ cwd: fileURLToPath(configPath), env: 'development' }),
        RedisModule.forRoot({ type: 'single', url: redisUrl }),
        CoreModule.forRoot(),
        SecurityModule.forRootAsync({
          useFactory: (config: ConfigService) => config.get<SecurityOptions>('security'),
          inject: [ConfigService],
        }),
      ],
      controllers,
      providers,
    }).compile()
    const app = module.createNestApplication()
    app.useLogger(false)
    await app.init()
    return { app, module }
  }

  async function issue(userName?: string): Promise<string> {
    const response = await request(issuer.getHttpServer()).post('/fixture/login').send({ userName }).expect(200)
    return response.body.token
  }

  beforeAll(async () => {
    const system = await createApp(new URL('../../vivy-system/src/config', import.meta.url), [SessionIssuerController])
    issuer = system.app
    tokenService = system.module.get(TokenService)
    const ai = await createApp(
      new URL('../src/config', import.meta.url),
      [ModelController, AppController],
      [AppService, { provide: ModelService, useValue: modelService }]
    )
    consumer = ai.app
    // 两个应用各自读取自己的配置，密钥必须一致，登录态才能互认。
    const systemSecret = system.module.get(ConfigService).get('security.jwt.secret')
    expect(systemSecret).toBeTruthy()
    expect(ai.module.get(ConfigService).get('security.jwt.secret')).toBe(systemSecret)
    modelService.list.mockImplementation(async () => ({
      items: [{ userName: ai.module.get(SecurityContext).getUserName() }],
      meta: { totalItems: 1 },
    }))
    modelService.add.mockResolvedValue({ id: 'fixture-id' })
  })

  beforeEach(async () => {
    modelService.list.mockClear()
    modelService.add.mockClear()
    token = await issue()
  })

  afterAll(async () => {
    // 仅删除本套测试签发的会话，禁止 FLUSHDB 清理其他登录态。
    if (tokenService) await Promise.all(tokens.map((value) => tokenService.delLoginUser(value)))
    await consumer?.close()
    await issuer?.close()
  })

  it('consumes a token issued with system configuration in the AI permission guard', async () => {
    const response = await request(consumer.getHttpServer()).get('/ai/models').auth(token, { type: 'bearer' })
    expect(response.body).toMatchObject({ code: 200, data: { items: [{ userName: 'ai-auth-tester' }] } })
  })

  it('keeps the health endpoint public and rejects missing or invalid tokens', async () => {
    await request(consumer.getHttpServer()).get('/').expect(200).expect('Hello World Vivy AI!')
    for (const response of [
      await request(consumer.getHttpServer()).get('/ai/models'),
      await request(consumer.getHttpServer()).get('/ai/models').auth('invalid-token', { type: 'bearer' }),
    ]) {
      expect(response.body.code).toBe(401)
    }
    expect(modelService.list).not.toHaveBeenCalled()
  })

  it('rejects an otherwise valid JWT after its shared Redis session is removed', async () => {
    expect(tokenService.parseToken(token)).not.toBeNull()
    await tokenService.delLoginUser(token)
    const response = await request(consumer.getHttpServer()).get('/ai/models').auth(token, { type: 'bearer' })
    expect(response.body.code).toBe(401)
    expect(modelService.list).not.toHaveBeenCalled()
  })

  it('uses shared permissions for writes and derives the audit username from the session', async () => {
    const payload = {
      provider: 'openai',
      vendor: 'fixture',
      modelName: '测试模型',
      modelCode: 'fixture',
      baseUrl: 'https://fixture.example/v1',
      secretKey: 'sk-fixture-secret',
      createBy: 'overposted',
    }
    const denied = await request(consumer.getHttpServer())
      .post('/ai/models')
      .auth(token, { type: 'bearer' })
      .send(payload)
    expect(denied.body.code).toBe(403)
    expect(modelService.add).not.toHaveBeenCalled()

    const loginUser = await tokenService.getLoginUser(token)
    loginUser.permissions.push('ai:model:add')
    await tokenService.setLoginUser(loginUser)
    const allowed = await request(consumer.getHttpServer())
      .post('/ai/models')
      .auth(token, { type: 'bearer' })
      .send(payload)
    expect(allowed.body.code).toBe(200)
    expect(modelService.add).toHaveBeenCalledWith(expect.objectContaining({ createBy: 'ai-auth-tester' }))
  })

  it('isolates usernames during parallel requests with different shared sessions', async () => {
    const other = await issue('other-ai-tester')
    const responses = await Promise.all([
      request(consumer.getHttpServer()).get('/ai/models').auth(token, { type: 'bearer' }),
      request(consumer.getHttpServer()).get('/ai/models').auth(other, { type: 'bearer' }),
    ])
    expect(responses.map((response) => response.body.data.items[0].userName)).toEqual([
      'ai-auth-tester',
      'other-ai-tester',
    ])
  })
})
