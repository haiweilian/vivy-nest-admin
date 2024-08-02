import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateConfigParams, ListConfigParams, UpdateConfigParams, ConfigModel } from './model'
export * from './model'

/**
 * 查询参数配置列表
 */
export function listConfig(params: ListConfigParams) {
  return request<Pagination<ConfigModel>>('/config/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加参数配置
 */
export function addConfig(params: CreateConfigParams) {
  return request('/config/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新参数配置
 */
export function updateConfig(params: UpdateConfigParams) {
  return request('/config/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除参数配置
 */
export function deleteConfig(configIds: React.Key) {
  return request(`/config/delete/${configIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询参数配置详情
 */
export function infoConfig(configId: React.Key) {
  return request<ConfigModel>(`/config/info/${configId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询参数配置键值
 */
export function configValue(configKey: React.Key) {
  return request<string>(`/config/value/${configKey}`, {
    method: RequestEnum.GET,
  })
}
