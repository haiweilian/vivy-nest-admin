import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { CaptchaResult, LoginParams, LoginResult, RouterTreeResult } from './model'
export * from './model'

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
 * 验证码
 */
export function captcha() {
  return request<CaptchaResult>('/auth/captcha', {
    method: RequestEnum.GET,
  })
}

/**
 * 用户登录信息
 */
export function getUserInfo() {
  return request<LoginUserInfo>('/auth/user/info', {
    method: RequestEnum.GET,
  })
}

/**
 * 查询用户路由&菜单
 */
export function getUserRouters() {
  return request<RouterTreeResult[]>('/auth/user/routers', {
    method: RequestEnum.GET,
  })
}
