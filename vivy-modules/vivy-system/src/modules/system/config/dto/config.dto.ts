import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysConfig } from '../entities/sys-config.entity'

/**
 * 查询参数配置
 */
export class ListConfigDto extends PaginateDto {
  /** 参数名称 */
  @Allow()
  configName?: string

  /** 参数键名 */
  @Allow()
  configKey?: string

  /** 状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加参数配置
 */
export class CreateConfigDto extends OmitType(SysConfig, ['configId'] as const) {}

/**
 * 更新参数配置
 */
export class UpdateConfigDto extends OmitType(SysConfig, ['configId'] as const) {}
