import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { OnlineInfoResult, ListOnlineParams } from './model'
export * from './model'

/**
 * 在线用户列表
 */
export function listOnline(params: ListOnlineParams) {
  return request<OnlineInfoResult[]>('/online/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 强退在线用户
 */
export function logoutOnline(userSk: string) {
  return request(`/online/${userSk}`, {
    method: RequestEnum.DELETE,
  })
}
