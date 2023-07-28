import { request } from '@umijs/max'
import type { LoginInfoDto, LoginResultVo } from '@/apis/types/auth/auth'
import { RequestEnum } from '@/enums/httpEnum'

/**
 * 用户登录
 */
export function login(params: LoginInfoDto) {
  return request<LoginResultVo>('/auth/login', {
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
