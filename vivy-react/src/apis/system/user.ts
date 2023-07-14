import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type {
  SysUser,
  ListUserDto,
  CreateUserDto,
  UpdateUserDto,
  UserInfoVo,
} from '@/apis/types/system/user';

/**
 * 查询用户列表
 */
export function listUser(params: Partial<ListUserDto>) {
  return request<Pagination<SysUser>>('/system/user/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 添加用户
 */
export function addUser(params: Partial<CreateUserDto>) {
  return request('/system/user/add', {
    method: RequestEnum.POST,
    data: params,
  });
}

/**
 * 更新用户
 */
export function updateUser(params: Partial<UpdateUserDto>) {
  return request('/system/user/update', {
    method: RequestEnum.PUT,
    data: params,
  });
}

/**
 * 删除用户
 */
export function deleteUser(userIds: React.Key) {
  return request(`/system/user/delete/${userIds}`, {
    method: RequestEnum.DELETE,
  });
}

/**
 * 获取用户详情
 */
export function infoUser(userId: React.Key) {
  return request<UserInfoVo>(`/system/user/info/${userId}`, {
    method: RequestEnum.GET,
  });
}
