import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { CreateDictDataParams, ListDictDataParams, UpdateDictDataParams } from './model-params'
import type { DictDataResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 查询字典数据列表
 */
export function listDictData(params: ListDictDataParams) {
  return request<Pagination<DictDataResult>>('/dict/data/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加字典数据
 */
export function addDictData(params: CreateDictDataParams) {
  return request('/dict/data/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新字典数据
 */
export function updateDictData(params: UpdateDictDataParams) {
  return request('/dict/data/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除字典数据
 */
export function deleteDictData(postIds: React.Key) {
  return request(`/dict/data/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询字典数据详情
 */
export function infoDictData(postId: React.Key) {
  return request<DictDataResult>(`/dict/data/info/${postId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 根据字典类型查询字典数据列表
 */
export function getDictDataList(type: string) {
  return request<DictDataResult[]>(`/dict/data/list/${type}`, {
    method: RequestEnum.GET,
  })
}
