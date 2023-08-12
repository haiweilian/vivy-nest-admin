import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { ListGenParams, UpdateGenParams } from './model-params'
import type { GenTableResult } from './model-result'
export * from './model-params'
export * from './model-result'

/**
 * 查询代码生成表列表
 */
export function listGenTable(params: Partial<ListGenParams>) {
  return request<Pagination<GenTableResult>>('/gen/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 更新代码生成表
 */
export function updateGenTable(params: Partial<UpdateGenParams>) {
  return request('/gen/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除代码生成表
 */
export function deleteGenTable(tableIds: React.Key) {
  return request(`/gen/delete/${tableIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询代码生成表详情
 */
export function infoGenTable(tableId: React.Key) {
  return request<GenTableResult>(`/gen/info/${tableId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询数据库表列表
 */
export function listDbTable(params: Partial<ListGenParams>) {
  return request<GenTableResult[]>('/gen/dblist', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 导入表结构到代码生成表
 */
export function importDbTable(tableNames: React.Key) {
  return request(`/gen/import/${tableNames}`, {
    method: RequestEnum.POST,
  })
}

/**
 * 同步表结构到代码生成表
 */
export function syncDbTable(tableName: React.Key) {
  return request(`/gen/sync/${tableName}`, {
    method: RequestEnum.PUT,
  })
}

/**
 * 预览代码
 */
export function previewCode(tableName: React.Key) {
  return request(`/gen/preview/${tableName}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 下载代码
 */
export function downloadCode(tableName: React.Key) {
  return request(`/gen/download/${tableName}`, {
    method: RequestEnum.GET,
  })
}
