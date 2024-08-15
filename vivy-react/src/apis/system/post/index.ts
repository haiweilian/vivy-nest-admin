import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreatePostParams, ListPostParams, UpdatePostParams, PostModel } from './model'
export * from './model'

/**
 * 查询岗位列表
 */
export function listPost(params: ListPostParams) {
  return request<Pagination<PostModel>>(`/posts`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加岗位
 */
export function addPost(params: CreatePostParams) {
  return request(`/posts`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新岗位
 */
export function updatePost(postId: number, params: UpdatePostParams) {
  return request(`/posts/${postId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除岗位
 */
export function deletePost(postIds: number | string) {
  return request(`/posts/${postIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询岗位详情
 */
export function infoPost(postId: number) {
  return request<PostModel>(`/posts/${postId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询岗位选项列表
 */
export function postOptions() {
  return request<PostModel[]>(`/posts/options`, {
    method: RequestEnum.GET,
  })
}
