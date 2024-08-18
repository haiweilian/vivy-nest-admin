import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { ProfileInfoResult, UpdateProfileParams, UpdatePasswordParams, UpdateAvatarParams } from './model'
export * from './model'

/**
 * 查询个人信息
 */
export function getProfile() {
  return request<ProfileInfoResult>(`/profile`, {
    method: RequestEnum.GET,
  })
}

/**
 * 修改个人信息
 */
export function updateProfile(params: UpdateProfileParams) {
  return request(`/profile`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 修改个人密码
 */
export function updatePassword(params: UpdatePasswordParams) {
  return request(`/profile/password`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 修改个人头像
 */
export function updateAvatar(params: UpdateAvatarParams) {
  return request<string>(`/profile/avatar`, {
    method: RequestEnum.POST,
    data: params,
  })
}
