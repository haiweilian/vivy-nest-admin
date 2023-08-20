import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { DictTypeModel, CreateDictTypeParams, ListDictTypeParams, UpdateDictTypeParams } from './model'
export * from './model'

/**
 * 查询字典类型列表
 */
export function listDictType(params: ListDictTypeParams) {
  return request<Pagination<DictTypeModel>>('/dict/type/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加字典类型
 */
export function addDictType(params: CreateDictTypeParams) {
  return request('/dict/type/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新字典类型
 */
export function updateDictType(params: UpdateDictTypeParams) {
  return request('/dict/type/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除字典类型
 */
export function deleteDictType(postIds: React.Key) {
  return request(`/dict/type/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询字典类型详情
 */
export function infoDictType(postId: React.Key) {
  return request<DictTypeModel>(`/dict/type/info/${postId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询字典类型选项列表
 */
export function selectableDictType() {
  return request<DictTypeModel[]>('/dict/type/selectable/dictType', {
    method: RequestEnum.GET,
  })
}
