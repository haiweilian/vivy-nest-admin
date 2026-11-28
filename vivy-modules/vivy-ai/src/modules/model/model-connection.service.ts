import { ChatAnthropic } from '@langchain/anthropic'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { HumanMessage } from '@langchain/core/messages'
import type { AIMessageChunk } from '@langchain/core/messages'
import { ChatDeepSeek } from '@langchain/deepseek'
import { ChatOpenAI } from '@langchain/openai'
import { Injectable } from '@nestjs/common'
import { ServiceException } from '@vivy-common/core'
import type { AiModel } from './entities/ai-model.entity.js'
import { ModelProvider, ModelTestMode } from './model.types.js'
import type { ModelTestResult } from './model.types.js'

const TEST_TOOL_NAME = 'ai_connection_check'
const TEST_TOOL = {
  name: TEST_TOOL_NAME,
  description: '检查模型的工具调用连接，请传入简短测试消息。',
  schema: {
    type: 'object',
    properties: { message: { type: 'string', maxLength: 128 } },
    required: ['message'],
    additionalProperties: false,
  },
}

function parseUsage(value: unknown): ModelTestResult['usage'] {
  if (
    value &&
    typeof value === 'object' &&
    'input_tokens' in value &&
    'output_tokens' in value &&
    'total_tokens' in value &&
    typeof value.input_tokens === 'number' &&
    typeof value.output_tokens === 'number' &&
    typeof value.total_tokens === 'number' &&
    [value.input_tokens, value.output_tokens, value.total_tokens].every((count) => Number.isFinite(count) && count >= 0)
  ) {
    return { inputTokens: value.input_tokens, outputTokens: value.output_tokens, totalTokens: value.total_tokens }
  }
  return null
}

/** 不回传供应商原始错误、请求头和连接配置。 */
function connectionError(error: unknown): { errorCode: string; errorMessage: string } {
  const detail = (error && typeof error === 'object' ? error : {}) as { status?: number; code?: string; name?: string }
  if (detail.status === 401 || detail.status === 403) {
    return { errorCode: 'AUTHENTICATION_FAILED', errorMessage: '模型鉴权失败，请检查密钥和服务访问权限' }
  }
  if (detail.status === 429) {
    return { errorCode: 'RATE_LIMITED', errorMessage: '模型服务限流或额度不足，请稍后重试' }
  }
  if (detail.status === 404) {
    return { errorCode: 'MODEL_NOT_FOUND', errorMessage: '接口或模型不存在，请检查接口地址和模型标识' }
  }
  if (detail.status === 400 || detail.status === 422) {
    return { errorCode: 'INVALID_CONFIGURATION', errorMessage: '模型不接受测试请求，请检查适配器、接口地址和模型标识' }
  }
  if (
    detail.status === 408 ||
    detail.status === 504 ||
    /timeout|abort/i.test(detail.name ?? '') ||
    ['ETIMEDOUT', 'ECONNABORTED'].includes(detail.code)
  ) {
    return { errorCode: 'TIMEOUT', errorMessage: '模型连接测试超时，请检查服务状态' }
  }
  return { errorCode: 'CONNECTION_FAILED', errorMessage: '模型连接失败，请检查接口地址、网络和服务状态' }
}

/**
 * 模型连接测试，限制请求超时、重试和输出长度
 */
@Injectable()
export class ModelConnectionService {
  /**
   * 使用已保存配置验证文本流或工具调用
   * @param config 已保存的模型连接信息
   * @param mode 流式文本或工具调用
   * @returns 耗时、用量和脱敏错误，不回传供应商原始异常
   */
  async test(config: AiModel, mode: ModelTestMode): Promise<ModelTestResult> {
    const startedAt = Date.now()
    const signal = AbortSignal.timeout(30_000)
    const result: ModelTestResult = {
      success: false,
      mode,
      latencyMs: 0,
      response: '',
      streaming: false,
      usage: null,
      toolCalls: [],
    }
    try {
      const model = this.createTestModel(config)
      const runnable =
        mode === ModelTestMode.TOOL ? model.bindTools([TEST_TOOL], { tool_choice: TEST_TOOL_NAME }) : model
      const stream = await runnable.stream(
        [
          new HumanMessage(
            mode === ModelTestMode.TOOL
              ? '请调用 ai_connection_check 工具，将 message 设为“连接成功”。'
              : '请用中文简短回复“连接成功”。'
          ),
        ],
        { signal }
      )
      let message: AIMessageChunk | undefined
      for await (const chunk of stream) {
        result.streaming = true
        message = message ? message.concat(chunk) : chunk
      }
      result.response = message?.text.slice(0, 2000) ?? ''
      result.usage = parseUsage(message?.usage_metadata)
      if (mode === ModelTestMode.TOOL) {
        const calls = message?.tool_calls ?? []
        const valid =
          calls.length === 1 &&
          calls[0].name === TEST_TOOL_NAME &&
          typeof calls[0].args.message === 'string' &&
          calls[0].args.message.length <= 128 &&
          !message?.invalid_tool_calls?.length
        if (valid) {
          result.toolCalls = calls.map((call) => ({ name: call.name, args: { message: call.args.message } }))
          result.success = true
        } else {
          result.errorCode = 'TOOL_CALL_INVALID'
          result.errorMessage = '模型未返回有效的工具调用，请确认该模型支持工具调用'
        }
      } else {
        result.success = Boolean(result.response.trim())
        if (!result.success) {
          result.errorCode = 'EMPTY_RESPONSE'
          result.errorMessage = '模型没有返回文本，请确认该模型支持文本回复'
        }
      }
    } catch (error) {
      Object.assign(
        result,
        signal.aborted
          ? { errorCode: 'TIMEOUT', errorMessage: '模型连接测试超时，请检查服务状态' }
          : connectionError(error)
      )
    }
    result.latencyMs = Date.now() - startedAt
    return result
  }

  /** 为连接测试创建模型；实际业务的调用参数由各调用方设置。 */
  private createTestModel(config: AiModel): BaseChatModel {
    const options = {
      model: config.modelCode,
      apiKey: config.secretKey,
      timeout: 30_000,
      maxRetries: 0,
      maxTokens: 256,
      temperature: 0,
    }
    switch (config.provider) {
      case ModelProvider.OPENAI:
        return new ChatOpenAI({
          ...options,
          configuration: { baseURL: config.baseUrl },
          useResponsesApi: false,
          streamUsage: false,
        })
      case ModelProvider.DEEPSEEK:
        return new ChatDeepSeek({
          ...options,
          configuration: { baseURL: config.baseUrl },
          streamUsage: false,
        })
      case ModelProvider.ANTHROPIC:
        return new ChatAnthropic({ ...options, anthropicApiUrl: config.baseUrl })
      default:
        throw new ServiceException('模型适配器不受支持')
    }
  }
}
