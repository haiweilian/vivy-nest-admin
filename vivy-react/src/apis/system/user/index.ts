import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { UserInfoResult, UserModel, CreateUserParams, ListUserParams, UpdateUserParams } from './model'
export * from './model'

/**
 * 查询用户列表
 */
export function listUser(params: ListUserParams) {
  return request<Pagination<UserModel>>('/user/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加用户
 */
export function addUser(params: CreateUserParams) {
  return request('/user/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新用户
 */
export function updateUser(params: UpdateUserParams) {
  return request('/user/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除用户
 */
export function deleteUser(userIds: React.Key) {
  return request(`/user/delete/${userIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询用户详情
 */
export function infoUser(userId: React.Key) {
  return request<UserInfoResult>(`/user/info/${userId}`, {
    method: RequestEnum.GET,
  })
}
