import { RequestEnum } from '@/enums/httpEnum'
import { http } from '@/utils/http'
import type { CaptchaResult, LoginParams, LoginResult, RouterTreeResult } from './model'
export * from './model'

/**
 * 用户登录
 */
export function login(params: LoginParams) {
  return http.request<LoginResult>(
    RequestEnum.POST,
    '/auth/login',
    {
      data: params,
    },
    {
      isToken: false,
      skipErrorHandler: true,
    }
  )
}

/**
 * 用户退出
 */
export function logout() {
  return http.request(RequestEnum.POST, '/auth/logout')
}

/**
 * 验证码
 */
export function captcha() {
  return http.request<CaptchaResult>(RequestEnum.GET, '/auth/captcha')
}

/**
 * 用户登录信息
 */
export function getUserInfo() {
  return http.request<LoginUserInfo>(RequestEnum.GET, '/auth/user/info')
}

/**
 * 查询用户路由&菜单
 */
export function getUserRouters() {
  return http.request<RouterTreeResult[]>(RequestEnum.GET, '/auth/user/routers?framework=vue')
}
