export enum ModelProvider {
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
  ANTHROPIC = 'anthropic',
}

export enum ModelTestMode {
  CHAT = 'chat',
  TOOL = 'tool',
}

/** 管理接口白名单，凭据不进入响应。 */
export interface ModelView {
  id: string
  provider: ModelProvider
  vendor: string
  modelName: string
  modelCode: string
  baseUrl: string
  status: string
  hasCredential: boolean
  createBy?: string
  createTime: string
  updateBy?: string
  updateTime: string
}

/** 模型测试返回结果 */
export interface ModelTestResult {
  success: boolean
  mode: ModelTestMode
  latencyMs: number
  response: string
  streaming: boolean
  usage: { inputTokens: number; outputTokens: number; totalTokens: number } | null
  toolCalls: { name: string; args: Record<string, unknown> }[]
  errorCode?: string
  errorMessage?: string
}
