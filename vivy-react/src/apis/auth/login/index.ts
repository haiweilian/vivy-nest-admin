import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { ImageCaptchaResult, LoginParams, LoginResult, RouterTreeResult } from './model'
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
 * 图片验证码
 */
export function captchaImage() {
  return request<ImageCaptchaResult>('/auth/captchaImage', {
    method: RequestEnum.GET,
  })
}

/**
 * 用户登录信息
 */
export function getUserInfo() {
  return request<LoginUserInfo>('/auth/userInfo', {
    method: RequestEnum.GET,
    skipErrorHandler: true,
  })
}

/**
 * 查询用户路由&菜单
 */
export function getUserRouters() {
  return request<RouterTreeResult[]>('/auth/userRouters', {
    method: RequestEnum.GET,
    skipErrorHandler: true,
  })
}
