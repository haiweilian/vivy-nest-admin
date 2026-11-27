import { Test } from '@nestjs/testing'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { modelProviderServer } from '../../../../test/helpers/model-provider-server.js'
import { AiModel } from './entities/ai-model.entity.js'
import { ModelConnectionService } from './model-connection.service.js'
import { ModelProvider, ModelTestMode } from './model.types.js'

describe('AI model provider connections', () => {
  let server: Awaited<ReturnType<typeof modelProviderServer>>
  let connection: ModelConnectionService

  beforeAll(async () => {
    server = await modelProviderServer()
    const module = await Test.createTestingModule({ providers: [ModelConnectionService] }).compile()
    connection = module.get(ModelConnectionService)
    await module.close()
  })

  afterAll(async () => server?.close())

  function config(provider: ModelProvider, modelCode = 'fixture'): AiModel {
    return Object.assign(new AiModel(), {
      id: 'fixture-id',
      provider,
      vendor: 'fixture',
      modelName: 'fixture',
      modelCode,
      baseUrl: server.url + (provider === ModelProvider.ANTHROPIC ? '' : '/v1'),
      secretKey: 'sk-fixture-secret',
    })
  }

  it.each(Object.values(ModelProvider))('collects streamed text using the real %s SDK', async (provider) => {
    const result = await connection.test(config(provider), ModelTestMode.CHAT)
    expect(result).toMatchObject({ success: true, response: '连接成功', streaming: true, toolCalls: [] })
    const request = server.requests.at(-1)
    expect(request.body).toMatchObject({ model: 'fixture', stream: true, max_tokens: 256, temperature: 0 })
    expect(request.path).toBe(provider === ModelProvider.ANTHROPIC ? '/v1/messages' : '/v1/chat/completions')
    if (provider === ModelProvider.ANTHROPIC) {
      expect(result.usage).toEqual({ inputTokens: 10, outputTokens: 4, totalTokens: 14 })
    } else {
      expect(result.usage).toBeNull()
    }
  })

  it.each(Object.values(ModelProvider))(
    'reassembles streamed tool arguments using the real %s SDK',
    async (provider) => {
      const result = await connection.test(config(provider), ModelTestMode.TOOL)
      expect(result).toMatchObject({
        success: true,
        streaming: true,
        toolCalls: [{ name: 'ai_connection_check', args: { message: '连接成功' } }],
      })
      expect(server.requests.at(-1).body.tools).toHaveLength(1)
    }
  )

  it('does not expose a provider error that contains the credential', async () => {
    const result = await connection.test(config(ModelProvider.OPENAI, 'fixture-auth-failure'), ModelTestMode.CHAT)
    expect(result).toMatchObject({ success: false, errorCode: 'AUTHENTICATION_FAILED' })
    expect(JSON.stringify(result)).not.toContain('sk-fixture-secret')
    expect(JSON.stringify(result)).not.toContain('Rejected')
  })

  it('aborts an unresponsive connection using the test caller deadline', async () => {
    const originalTimeout = AbortSignal.timeout.bind(AbortSignal)
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockImplementation(() => originalTimeout(50))
    const result = await connection.test(config(ModelProvider.OPENAI, 'fixture-timeout'), ModelTestMode.CHAT)
    expect(result).toMatchObject({ success: false, errorCode: 'TIMEOUT' })
    expect(timeout).toHaveBeenCalledWith(30_000)
    expect(result.latencyMs).toBeLessThan(5000)
  })
})
