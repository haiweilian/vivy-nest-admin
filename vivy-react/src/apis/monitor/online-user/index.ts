import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { OnlineUserResult, ListOnlineUserParams } from './model'
export * from './model'

/**
 * 在线用户列表
 */
export function listOnlineUser(params: ListOnlineUserParams) {
  return request<OnlineUserResult[]>('/online-users', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 强退在线用户
 */
export function logoutOnlineUser(userSk: string) {
  return request(`/online-users/${userSk}`, {
    method: RequestEnum.DELETE,
  })
}
