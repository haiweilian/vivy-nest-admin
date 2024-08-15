/**
 * 参数配置信息
 */
export interface ConfigModel {
  /** 参数编号 */
  configId: number

  /** 参数名称 */
  configName: string

  /** 参数键名 */
  configKey: string

  /** 参数键值 */
  configValue: string

  /** 状态（0正常 1停用） */
  status: string

  /** 备注 */
  remark: string
}

/**
 * 查询参数配置
 */
export interface ListConfigParams extends PaginateParams {
  /** 参数名称 */
  configName?: string

  /** 参数键名 */
  configKey?: string

  /** 状态（0正常 1停用） */
  status?: string
}

/**
 * 添加参数配置
 */
export type CreateConfigParams = Omit<ConfigModel, 'configId'>

/**
 * 更新参数配置
 */
export type UpdateConfigParams = Omit<ConfigModel, 'configId'>
