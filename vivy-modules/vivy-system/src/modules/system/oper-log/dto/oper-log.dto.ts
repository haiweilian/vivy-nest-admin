import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysOperLog } from '../entities/sys-oper-log.entity'

/**
 * 列表
 */
export class ListOperLogDto extends PaginateDto {
  /** 模块标题 */
  @Allow()
  title?: string = ''

  /** 操作类型(enum OperType) */
  @Allow()
  operType?: number

  /** 操作人员 */
  @Allow()
  operName?: string = ''

  /** 操作状态(enum OperStatus) */
  @Allow()
  operStatus?: number

  /** 请求地址 */
  @Allow()
  requestUrl?: string = ''

  /** 操作时间 */
  @Allow()
  createTime?: string[]
}

/**
 * 新增
 */
export class CreateOperLogDto extends OmitType(SysOperLog, ['operId'] as const) {}
