import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { LoginParams } from './model-params'
import type { LoginResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 用户登录
 */
export function login(params: LoginParams) {
  return request<LoginResult>('/auth/login', {
    method: RequestEnum.POST,
    data: params,
    isToken: false,
    skipErrorHandler: true,
  })
}

/**
 * 用户退出
 */
export function logout() {
  return request('/auth/logout', {
    method: RequestEnum.POST,
  })
}

/**
 * 用户登录信息
 */
export function getLoginUserInfo() {
  return request<LoginUserInfo>('/auth/getLoginUserInfo', {
    method: RequestEnum.GET,
    skipErrorHandler: true,
  })
}
