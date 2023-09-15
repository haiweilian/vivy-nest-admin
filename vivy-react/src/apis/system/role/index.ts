import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { RoleInfoResult, RoleModel, CreateRoleParams, ListRoleParams, UpdateRoleParams } from './model'
export * from './model'

/**
 * 查询角色列表
 */
export function listRole(params: ListRoleParams) {
  return request<Pagination<RoleModel>>('/role/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加角色
 */
export function addRole(params: CreateRoleParams) {
  return request('/role/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新角色
 */
export function updateRole(params: UpdateRoleParams) {
  return request('/role/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除角色
 */
export function deleteRole(roleIds: React.Key) {
  return request(`/role/delete/${roleIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询角色详情
 */
export function infoRole(roleId: React.Key) {
  return request<RoleInfoResult>(`/role/info/${roleId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询角色选项列表
 */
export function optionRole() {
  return request<RoleModel[]>('/role/option/list', {
    method: RequestEnum.GET,
  })
}
