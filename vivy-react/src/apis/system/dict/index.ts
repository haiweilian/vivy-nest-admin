import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type {
  DictTypeModel,
  CreateDictTypeParams,
  ListDictTypeParams,
  UpdateDictTypeParams,
  DictDataModel,
  CreateDictDataParams,
  ListDictDataParams,
  UpdateDictDataParams,
} from './model'
export * from './model'

/**
 * 查询字典类型列表
 */
export function listDictType(params: ListDictTypeParams) {
  return request<Pagination<DictTypeModel>>(`/dict/types`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加字典类型
 */
export function addDictType(params: CreateDictTypeParams) {
  return request(`/dict/types`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新字典类型
 */
export function updateDictType(dictId: number, params: UpdateDictTypeParams) {
  return request(`/dict/types/${dictId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除字典类型
 */
export function deleteDictType(dictIds: number | string) {
  return request(`/dict/types/${dictIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询字典类型详情
 */
export function infoDictType(dictId: number) {
  return request<DictTypeModel>(`/dict/types/${dictId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询字典类型选项列表
 */
export function dictTypeOptions() {
  return request<DictTypeModel[]>(`/dict/types/options`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询字典数据列表
 */
export function listDictData(params: ListDictDataParams) {
  return request<Pagination<DictDataModel>>(`/dict/datas`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加字典数据
 */
export function addDictData(params: CreateDictDataParams) {
  return request(`/dict/datas`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新字典数据
 */
export function updateDictData(dictId: number, params: UpdateDictDataParams) {
  return request(`/dict/datas/${dictId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除字典数据
 */
export function deleteDictData(dictIds: number | string) {
  return request(`/dict/datas/${dictIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询字典数据详情
 */
export function infoDictData(dictId: number) {
  return request<DictDataModel>(`/dict/datas/${dictId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 根据字典类型查询字典数据列表
 */
export function dictDataOptions(dictType: string) {
  return request<DictDataModel[]>(`/dict/datas/options/${dictType}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 刷新字典缓存
 */
export function refreshDictCache() {
  return request(`/dict/types/refresh-cache`, {
    method: RequestEnum.DELETE,
  })
}
