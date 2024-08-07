import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { ProfileInfoResult, UpdateProfileParams, UpdatePasswordParams } from './model'
export * from './model'

/**
 * 查询个人信息
 */
export function getProfile() {
  return request<ProfileInfoResult>('/profile', {
    method: RequestEnum.GET,
  })
}

/**
 * 修改个人信息
 */
export function updateProfile(params: UpdateProfileParams) {
  return request('/profile/updateProfile', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 修改个人密码
 */
export function updatePassword(params: UpdatePasswordParams) {
  return request('/profile/updatePassword', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 修改个人头像
 */
export function updateAvatar(params: FormData) {
  return request<string>('/profile/updateAvatar', {
    method: RequestEnum.PUT,
    data: params,
  })
}
