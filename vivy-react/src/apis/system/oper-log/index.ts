import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { ListOperLogParams } from './model-params'
import type { OperLogResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 查询操作日志列表
 */
export function listOperLog(params: ListOperLogParams) {
  return request<Pagination<OperLogResult>>('/oper/log/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 清空操作日志
 */
export function clearOperLog() {
  return request('/oper/log/clear', {
    method: RequestEnum.DELETE,
  })
}
