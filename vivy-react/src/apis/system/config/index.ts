import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateConfigParams, ListConfigParams, UpdateConfigParams, ConfigModel } from './model'
export * from './model'

/**
 * 查询参数配置列表
 */
export function listConfig(params: ListConfigParams) {
  return request<Pagination<ConfigModel>>(`/configs`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加参数配置
 */
export function addConfig(params: CreateConfigParams) {
  return request(`/configs`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新参数配置
 */
export function updateConfig(configId: number, params: UpdateConfigParams) {
  return request(`/configs/${configId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除参数配置
 */
export function deleteConfig(configIds: number | string) {
  return request(`/configs/${configIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询参数配置详情
 */
export function infoConfig(configId: number) {
  return request<ConfigModel>(`/configs/${configId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询参数配置键值
 */
export function configValue(configKey: string) {
  return request<string>(`/configs/${configKey}/value`, {
    method: RequestEnum.GET,
  })
}

/**
 * 刷新参数配置缓存
 */
export function refreshConfigCache() {
  return request(`/configs/refresh-cache`, {
    method: RequestEnum.DELETE,
  })
}
