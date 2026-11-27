/**
 * 模型适配器
 */
export type ModelProvider = 'openai' | 'deepseek' | 'anthropic'

/**
 * 连接测试方式
 */
export type ModelTestMode = 'chat' | 'tool'

/**
 * 模型信息
 */
export interface AiModel {
  /** 模型ID */
  id: string

  /** 模型适配器 */
  provider: ModelProvider

  /** 模型来源 */
  vendor: string

  /** 模型名称 */
  modelName: string

  /** 模型标识 */
  modelCode: string

  /** 接口地址 */
  baseUrl: string

  /** 状态（0正常 1停用） */
  status: string

  /** 是否已配置接口密钥 */
  hasCredential: boolean

  /** 创建者 */
  createBy?: string

  /** 创建时间 */
  createTime: string

  /** 更新者 */
  updateBy?: string

  /** 更新时间 */
  updateTime: string
}

/**
 * 查询模型
 */
export interface ListModelParams extends PaginateParams {
  /** 模型名称、来源或模型标识 */
  search?: string

  /** 模型适配器 */
  provider?: ModelProvider

  /** 状态（0正常 1停用） */
  status?: string
}

/**
 * 添加模型
 */
export interface CreateModelParams {
  /** 模型适配器 */
  provider: ModelProvider

  /** 模型来源 */
  vendor: string

  /** 模型名称 */
  modelName: string

  /** 模型标识 */
  modelCode: string

  /** 接口地址 */
  baseUrl: string

  /** 接口密钥 */
  secretKey: string

  /** 状态（0正常 1停用），默认停用 */
  status?: string
}

/**
 * 更新模型
 * 密钥不回显，未填写的字段不提交，提交的字段才覆盖原值
 */
export type UpdateModelParams = Partial<CreateModelParams>

/**
 * 模型连接测试结果
 */
export interface ModelTestResult {
  /** 是否成功 */
  success: boolean

  /** 测试方式 */
  mode: ModelTestMode

  /** 耗时（毫秒） */
  latencyMs: number

  /** 模型返回内容 */
  response: string

  /** 是否流式返回 */
  streaming: boolean

  /** Token 用量 */
  usage: { inputTokens: number; outputTokens: number; totalTokens: number } | null

  /** 工具调用 */
  toolCalls: { name: string; args: Record<string, unknown> }[]

  /** 错误码 */
  errorCode?: string

  /** 错误信息 */
  errorMessage?: string
}
