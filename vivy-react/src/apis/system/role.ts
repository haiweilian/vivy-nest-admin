import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type {
  SysRole,
  ListRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  RoleInfoVo,
} from '@/apis/types/system/role';

/**
 * 查询角色列表
 */
export function listRole(params: Partial<ListRoleDto>) {
  return request<Pagination<SysRole>>('/system/role/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 添加角色
 */
export function addRole(params: Partial<CreateRoleDto>) {
  return request('/system/role/add', {
    method: RequestEnum.POST,
    data: params,
  });
}

/**
 * 更新角色
 */
export function updateRole(params: Partial<UpdateRoleDto>) {
  return request('/system/role/update', {
    method: RequestEnum.PUT,
    data: params,
  });
}

/**
 * 删除角色
 */
export function deleteRole(roleIds: React.Key) {
  return request(`/system/role/delete/${roleIds}`, {
    method: RequestEnum.DELETE,
  });
}

/**
 * 获取角色详情
 */
export function infoRole(roleId: React.Key) {
  return request<RoleInfoVo>(`/system/role/info/${roleId}`, {
    method: RequestEnum.GET,
  });
}

/**
 * 查询角色选项列表
 */
export function selectableRole() {
  return request<SysRole[]>('/system/role/options/selectable', {
    method: RequestEnum.GET,
  });
}
