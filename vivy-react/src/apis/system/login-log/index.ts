import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { ListLoginLogParams } from './model-params'
import type { LoginLogListResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 查询登录日志列表
 */
export function listLoginLog(params: ListLoginLogParams) {
  return request<Pagination<LoginLogListResult>>('/login/log/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 清空登录日志
 */
export function clearLoginLog() {
  return request('/login/log/clear', {
    method: RequestEnum.DELETE,
  })
}
