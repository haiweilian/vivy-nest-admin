import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CacheResult } from './model'
export * from './model'

/**
 * 查询缓存名称列表
 */
export function getCaches() {
  return request<CacheResult[]>(`/caches`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询缓存键名列表
 */
export function getCacheKeys(name: string) {
  return request<CacheResult[]>(`/caches/${name}/keys`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询缓存内容
 */
export function getCacheValue(name: string, key: string) {
  return request<CacheResult>(`/caches/${name}/keys/${key}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 删除全部缓存内容
 */
export function deleteCaches() {
  return request(`/caches`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 根据缓存名称删除缓存内容
 */
export function deleteCacheByName(name: string) {
  return request(`/caches/${name}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 根据缓存键名删除缓存内容
 */
export function deleteCacheByNameAndKey(name: string, key: string) {
  return request(`/caches/${name}/keys/${key}`, {
    method: RequestEnum.DELETE,
  })
}
