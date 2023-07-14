import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type { SysPost, ListPostDto, CreatePostDto, UpdatePostDto } from '@/apis/types/system/post';

/**
 * 查询岗位列表
 */
export function listPost(params: Partial<ListPostDto>) {
  return request<Pagination<SysPost>>('/system/post/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 添加岗位
 */
export function addPost(params: Partial<CreatePostDto>) {
  return request('/system/post/add', {
    method: RequestEnum.POST,
    data: params,
  });
}

/**
 * 更新岗位
 */
export function updatePost(params: Partial<UpdatePostDto>) {
  return request('/system/post/update', {
    method: RequestEnum.PUT,
    data: params,
  });
}

/**
 * 删除岗位
 */
export function deletePost(postIds: React.Key) {
  return request(`/system/post/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  });
}

/**
 * 获取岗位详情
 */
export function infoPost(postId: React.Key) {
  return request<SysPost>(`/system/post/info/${postId}`, {
    method: RequestEnum.GET,
  });
}

/**
 * 查询岗位选项列表
 */
export function selectablePost() {
  return request<SysPost[]>('/system/post/options/selectable', {
    method: RequestEnum.GET,
  });
}
