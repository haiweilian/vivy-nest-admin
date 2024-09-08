import { request } from '@umijs/max'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { UserInfoResult, UserModel, CreateUserParams, ListUserParams, UpdateUserParams } from './model'
export * from './model'

/**
 * 查询用户列表
 */
export function listUser(params: ListUserParams) {
  return request<Pagination<UserModel>>(`/users`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加用户
 */
export function addUser(params: CreateUserParams) {
  return request(`/users`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新用户
 */
export function updateUser(userId: number, params: UpdateUserParams) {
  return request(`/users/${userId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除用户
 */
export function deleteUser(userIds: number | string) {
  return request(`/users/${userIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询用户详情
 */
export function infoUser(userId: number) {
  return request<UserInfoResult>(`/users/${userId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 导出用户列表
 */
export function exportUserList() {
  return request(`/users/export`, {
    method: RequestEnum.POST,
    responseType: 'blob',
    getResponse: true,
  })
}

/**
 * 导出用户模板
 */
export function exportUserTemplate() {
  return request(`/users/export-template`, {
    method: RequestEnum.POST,
    responseType: 'blob',
    getResponse: true,
  })
}

/**
 * 导入用户列表
 */
export function importUserList(data: FormData) {
  return request(`/users/import`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  })
}
