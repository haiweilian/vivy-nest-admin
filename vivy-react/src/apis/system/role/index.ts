import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { RoleInfoResult, RoleModel, CreateRoleParams, ListRoleParams, UpdateRoleParams } from './model'
export * from './model'

/**
 * 查询角色列表
 */
export function listRole(params: ListRoleParams) {
  return request<Pagination<RoleModel>>(`/roles`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加角色
 */
export function addRole(params: CreateRoleParams) {
  return request(`/roles`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新角色
 */
export function updateRole(roleId: number, params: UpdateRoleParams) {
  return request(`/roles/${roleId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除角色
 */
export function deleteRole(roleIds: number | string) {
  return request(`/roles/${roleIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询角色详情
 */
export function infoRole(roleId: number) {
  return request<RoleInfoResult>(`/roles/${roleId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询角色选项列表
 */
export function roleOptions() {
  return request<RoleModel[]>(`/roles/options`, {
    method: RequestEnum.GET,
  })
}
