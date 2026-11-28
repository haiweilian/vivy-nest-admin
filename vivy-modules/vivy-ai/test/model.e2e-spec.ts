import { readFile } from 'node:fs/promises'
import { Global, Module } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SecurityContext } from '@vivy-common/core'
import { ServiceExceptionFilter } from '@vivy-common/core/lib/exceptions-filters/service.filter.js'
import { UnknownExceptionFilter } from '@vivy-common/core/lib/exceptions-filters/unknown.filter.js'
import { HttpStatusInterceptor } from '@vivy-common/core/lib/interceptors/http-status.interceptor.js'
import { ValidationPipe } from '@vivy-common/core/lib/pipes/validation.pipe.js'
import { AuthService } from '@vivy-common/security'
import { RequireAuthGuard } from '@vivy-common/security/lib/guards/require-auth.guard.js'
import request from 'supertest'
import { DataSource } from 'typeorm'
import type { Repository } from 'typeorm'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { AiModel } from '../src/modules/model/entities/ai-model.entity.js'
import { ModelModule } from '../src/modules/model/model.module.js'
import { ModelService } from '../src/modules/model/model.service.js'
import { modelProviderServer } from './helpers/model-provider-server.js'

const postgresUrl = process.env.AI_TEST_PG_URL
if (postgresUrl && new URL(postgresUrl).pathname !== '/vivy_ai_test') {
  throw new Error('AI_TEST_PG_URL 必须指向独立的 vivy_ai_test 测试库')
}
const allPermissions = [
  'ai:model:list',
  'ai:model:query',
  'ai:model:add',
  'ai:model:update',
  'ai:model:delete',
  'ai:model:test',
  'ai:chat:use',
]
let permissions = [...allPermissions]
const identity = {
  getUserName: () => 'model-tester',
  getToken: () => 'fixture-token',
  getLoginUser: () => ({ roles: ['common'], permissions }),
}

@Global()
@Module({
  providers: [{ provide: SecurityContext, useValue: identity }],
  exports: [SecurityContext],
})
class ModelTestContextModule {}

describe.skipIf(!postgresUrl)('AI models HTTP with isolated PostgreSQL', () => {
  let app: INestApplication
  let repository: Repository<AiModel>
  let service: ModelService
  let server: Awaited<ReturnType<typeof modelProviderServer>>

  beforeAll(async () => {
    server = await modelProviderServer()
    const module = await Test.createTestingModule({
      imports: [
        ModelTestContextModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: postgresUrl,
          entities: [AiModel],
          synchronize: false,
          logging: false,
        }),
        ModelModule,
      ],
      providers: [AuthService, { provide: APP_GUARD, useClass: RequireAuthGuard }],
    }).compile()
    await module
      .get(DataSource)
      .query(await readFile(new URL('../../../sql/postgres/vivy-ai.sql', import.meta.url), 'utf8'))
    app = module.createNestApplication()
    app.useLogger(false)
    app.useGlobalPipes(ValidationPipe)
    app.useGlobalFilters(new UnknownExceptionFilter(), new ServiceExceptionFilter())
    app.useGlobalInterceptors(new HttpStatusInterceptor())
    await app.init()
    repository = module.get(DataSource).getRepository(AiModel)
    service = module.get(ModelService)
  })

  beforeEach(async () => {
    permissions = [...allPermissions]
    await repository.clear()
  })

  afterAll(async () => {
    await repository?.clear()
    await app?.close()
    await server?.close()
  })

  function payload(extra: Record<string, unknown> = {}) {
    return {
      provider: 'openai',
      vendor: 'fixture',
      modelName: '测试模型',
      modelCode: 'fixture',
      baseUrl: server.url + '/v1',
      secretKey: 'sk-fixture-secret',
      ...extra,
    }
  }

  async function create(extra: Record<string, unknown> = {}): Promise<string> {
    const response = await request(app.getHttpServer()).post('/ai/models').send(payload(extra)).expect(200)
    expect(response.body.code).toBe(200)
    return response.body.data.id
  }

  async function storedModel(id: string): Promise<AiModel> {
    return repository.createQueryBuilder('model').addSelect('model.secretKey').where('model.id = :id', { id }).getOne()
  }

  it('creates disabled models with plaintext credentials and server-owned audit fields', async () => {
    const id = await create({ createBy: 'overposted', id: 'overposted' })
    const stored = await storedModel(id)
    expect(stored).toMatchObject({ status: '1', createBy: 'model-tester' })
    expect(stored.updateBy ?? null).toBeNull()
    expect(stored.secretKey).toBe('sk-fixture-secret')
    expect((await repository.findOneBy({ id })).secretKey).toBeUndefined()
    const detail = await request(app.getHttpServer())
      .get('/ai/models/' + id)
      .expect(200)
    expect(detail.body.data.hasCredential).toBe(true)
    expect(JSON.stringify(detail.body)).not.toContain('secretKey')
  })

  it('filters and paginates lists without exposing credentials', async () => {
    await create()
    await create({ vendor: 'another', modelName: '其他模型', status: '0' })
    const response = await request(app.getHttpServer())
      .get('/ai/models')
      .query({ page: 1, limit: 1, search: '其他', provider: 'openai', status: '0' })
      .expect(200)
    expect(response.body.data.items).toHaveLength(1)
    expect(response.body.data.meta.totalItems).toBe(1)
    expect(response.body.data.items[0].modelName).toBe('其他模型')
    expect(JSON.stringify(response.body)).not.toContain('sk-fixture-secret')
    expect(JSON.stringify(response.body)).not.toContain('secretKey')
  })

  it.each(['vendor', 'modelName', 'modelCode'])('searches %s without case sensitivity in PostgreSQL', async (field) => {
    await create({ [field]: 'GPT-Fixture' })
    const response = await request(app.getHttpServer()).get('/ai/models').query({ search: 'gpt-fixture' })
    expect(response.body.code).toBe(200)
    expect(response.body.data.items).toHaveLength(1)
    expect(response.body.data.items[0][field]).toBe('GPT-Fixture')
  })

  it('updates status and reads saved connection information for server callers', async () => {
    const id = await create()
    await request(app.getHttpServer())
      .put('/ai/models/' + id + '/status')
      .send({ status: '0' })
      .expect(200)
    await request(app.getHttpServer())
      .put('/ai/models/' + id)
      .send({ modelCode: 'changed', secretKey: 'sk-new-fixture' })
    expect(await service.find(id)).toMatchObject({
      modelCode: 'changed',
      secretKey: 'sk-new-fixture',
      status: '0',
      updateBy: 'model-tester',
    })
  })

  it('preserves omitted credentials and rejects empty credentials', async () => {
    const id = await create()
    const original = await storedModel(id)
    await request(app.getHttpServer())
      .put('/ai/models/' + id)
      .send({ modelName: '已修改' })
    const updated = await storedModel(id)
    expect(updated.secretKey).toBe(original.secretKey)
    expect(updated.modelName).toBe('已修改')
    await request(app.getHttpServer())
      .put('/ai/models/' + id)
      .send({
        secretKey: null,
        modelName: null,
        provider: null,
        vendor: null,
        modelCode: null,
        baseUrl: null,
        status: null,
      })
      .expect(200)
      .expect((response) => expect(response.body.code).toBe(200))
    expect(await storedModel(id)).toMatchObject({
      secretKey: original.secretKey,
      modelName: '已修改',
      provider: original.provider,
      vendor: original.vendor,
      modelCode: original.modelCode,
      baseUrl: original.baseUrl,
      status: original.status,
    })
    for (const secretKey of ['', '   ']) {
      const invalid = await request(app.getHttpServer())
        .put('/ai/models/' + id)
        .send({ secretKey })
      expect(invalid.body.code).toBe(400)
    }
    expect((await storedModel(id)).secretKey).toBe(original.secretKey)
  })

  it('keeps independently provided fields during concurrent partial updates', async () => {
    const id = await create()
    const responses = await Promise.all([
      request(app.getHttpServer())
        .put('/ai/models/' + id)
        .send({ vendor: '新来源' }),
      request(app.getHttpServer())
        .put('/ai/models/' + id)
        .send({ modelName: '新名称' }),
    ])
    expect(responses.map((response) => response.body.code)).toEqual([200, 200])
    expect(await storedModel(id)).toMatchObject({ vendor: '新来源', modelName: '新名称' })
  })

  it('validates fields and page limits', async () => {
    for (const extra of [
      { provider: 'unknown' },
      { baseUrl: 'file:///tmp/example' },
      { status: '2' },
      { secretKey: 'sk fixture' },
      { modelName: ' ' },
    ]) {
      const response = await request(app.getHttpServer()).post('/ai/models').send(payload(extra))
      expect(response.body.code).toBe(400)
    }
    const page = await request(app.getHttpServer()).get('/ai/models').query({ limit: 0 })
    expect(page.body.code).toBe(400)
  })

  it('rejects missing operation permissions through the existing permission guard', async () => {
    const id = await create()
    permissions = ['ai:model:list']
    expect((await request(app.getHttpServer()).get('/ai/models')).body.code).toBe(200)
    for (const response of await Promise.all([
      request(app.getHttpServer()).post('/ai/models').send(payload()),
      request(app.getHttpServer()).get('/ai/models/' + id),
      request(app.getHttpServer())
        .put('/ai/models/' + id)
        .send({ modelName: 'forbidden' }),
      request(app.getHttpServer()).delete('/ai/models/' + id),
      request(app.getHttpServer())
        .post('/ai/models/' + id + '/test')
        .send({ mode: 'chat' }),
    ])) {
      expect(response.body.code).toBe(403)
    }
    expect(await repository.count()).toBe(1)
  })

  it('tests a disabled stored model using the server credential, ignoring caller connection fields', async () => {
    const id = await create()
    const response = await request(app.getHttpServer())
      .post('/ai/models/' + id + '/test')
      .send({ mode: 'chat', secretKey: 'sk-overposted', baseUrl: 'http://untrusted.invalid' })
    expect(response.body.data).toMatchObject({ success: true, response: '连接成功', streaming: true })
    expect(server.requests.at(-1).authorization).toBe('Bearer sk-fixture-secret')
    const tool = await request(app.getHttpServer())
      .post('/ai/models/' + id + '/test')
      .send({ mode: 'tool' })
    expect(tool.body.data).toMatchObject({
      success: true,
      toolCalls: [{ name: 'ai_connection_check', args: { message: '连接成功' } }],
    })
  })

  it('returns structured provider failures and does not expose provider credentials', async () => {
    const id = await create({ modelCode: 'fixture-auth-failure' })
    const response = await request(app.getHttpServer())
      .post('/ai/models/' + id + '/test')
      .send({ mode: 'chat' })
    expect(response.body).toMatchObject({ code: 200, data: { success: false, errorCode: 'AUTHENTICATION_FAILED' } })
    expect(JSON.stringify(response.body)).not.toContain('sk-fixture-secret')
  })

  it('removes a configuration and reports missing models through the business error protocol', async () => {
    const id = await create()
    expect((await request(app.getHttpServer()).delete('/ai/models/' + id)).body.code).toBe(200)
    expect(await repository.count()).toBe(0)
    const missing = await request(app.getHttpServer()).get('/ai/models/' + id)
    expect(missing.body).toMatchObject({ code: 400, message: '模型配置不存在' })
  })
})
