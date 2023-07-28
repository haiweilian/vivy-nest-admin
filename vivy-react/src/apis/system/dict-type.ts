import { request } from '@umijs/max'
import type { Pagination } from '@/apis/types/models'
import type { SysDictType, ListDictTypeDto, CreateDictTypeDto, UpdateDictTypeDto } from '@/apis/types/system/dict-type'
import { RequestEnum } from '@/enums/httpEnum'

/**
 * 查询字典类型列表
 */
export function listDictType(params: Partial<ListDictTypeDto>) {
  return request<Pagination<SysDictType>>('/system/dict/type/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加字典类型
 */
export function addDictType(params: Partial<CreateDictTypeDto>) {
  return request('/system/dict/type/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新字典类型
 */
export function updateDictType(params: Partial<UpdateDictTypeDto>) {
  return request('/system/dict/type/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除字典类型
 */
export function deleteDictType(postIds: React.Key) {
  return request(`/system/dict/type/delete/${postIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 获取字典类型详情
 */
export function infoDictType(postId: React.Key) {
  return request<SysDictType>(`/system/dict/type/info/${postId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询字典类型选项列表
 */
export function selectableDictType() {
  return request<SysDictType[]>('/system/dict/type/options/selectable', {
    method: RequestEnum.GET,
  })
}
