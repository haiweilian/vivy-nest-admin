import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type {
  AiModel,
  CreateModelParams,
  ListModelParams,
  ModelTestMode,
  ModelTestResult,
  UpdateModelParams,
} from './model'
export * from './model'

/**
 * 查询模型列表
 */
export function listModel(params: ListModelParams) {
  return request<Pagination<AiModel>>(`/ai/models`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加模型
 */
export function addModel(params: CreateModelParams) {
  return request(`/ai/models`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新模型
 */
export function updateModel(id: string, params: UpdateModelParams) {
  return request(`/ai/models/${id}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 更新模型状态
 */
export function updateModelStatus(id: string, status: string) {
  return request(`/ai/models/${id}/status`, {
    method: RequestEnum.PUT,
    data: { status },
  })
}

/**
 * 删除模型
 */
export function deleteModel(id: string) {
  return request(`/ai/models/${id}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询模型详情
 */
export function infoModel(id: string) {
  return request<AiModel>(`/ai/models/${id}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 测试模型连接
 */
export function testModel(id: string, mode: ModelTestMode) {
  return request<ModelTestResult>(`/ai/models/${id}/test`, {
    method: RequestEnum.POST,
    data: { mode },
    timeout: 1000 * 45,
  })
}
