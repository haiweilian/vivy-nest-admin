import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { OperLogModel, ListOperLogParams } from './model'
export * from './model'

/**
 * 查询操作日志列表
 */
export function listOperLog(params: ListOperLogParams) {
  return request<Pagination<OperLogModel>>('/oper/log/list', {
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
