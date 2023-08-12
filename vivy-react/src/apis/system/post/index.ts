import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreatePostParams, ListPostParams, UpdatePostParams } from './model-params'
import { PostResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 查询岗位列表
 */
export function listPost(params: ListPostParams) {
  return request<Pagination<PostResult>>('/post/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加岗位
 */
export function addPost(params: CreatePostParams) {
  return request('/post/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新岗位
 */
export function updatePost(params: UpdatePostParams) {
  return request('/post/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除岗位
 */
export function deletePost(postIds: React.Key) {
  return request(`/post/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询岗位详情
 */
export function infoPost(postId: React.Key) {
  return request<PostResult>(`/post/info/${postId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询岗位选项列表
 */
export function selectablePost() {
  return request<PostResult[]>('/post/selectable/post', {
    method: RequestEnum.GET,
  })
}
