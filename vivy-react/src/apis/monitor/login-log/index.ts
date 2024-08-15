import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { LoginLogListResult, ListLoginLogParams } from './model'
export * from './model'

/**
 * 查询登录日志列表
 */
export function listLoginLog(params: ListLoginLogParams) {
  return request<Pagination<LoginLogListResult>>('/login-logs', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 清空登录日志
 */
export function clearLoginLog() {
  return request('/login-logs/clear', {
    method: RequestEnum.DELETE,
  })
}
