import { PaginateDto } from '@vivy-common/core'
import { OperType, OperStatus } from '@vivy-common/logger'
import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 列表
 */
export class ListOperLogDto extends PaginateDto {
  /** 模块标题 */
  @Allow()
  title: string = ''

  /** 操作类型(enum OperType) */
  @Allow()
  operType: OperType

  /** 操作人员 */
  @Allow()
  operName: string = ''

  /** 操作状态(enum OperStatus) */
  @Allow()
  operStatus: OperStatus

  /** 请求地址 */
  @Allow()
  requestUrl: string = ''

  /** 操作时间 */
  @Allow()
  createdTime: string[]
}

/**
 * 新增
 */
export class CreateOperLogDto {
  /** 模块标题 */
  @IsNotEmpty()
  @MaxLength(50)
  title: string

  /** 操作类型(enum OperType) */
  @IsOptional()
  @IsInt()
  operType: OperType

  /** 操作人员 */
  @IsOptional()
  @MaxLength(50)
  operName: string

  /** 方法名称 */
  @IsOptional()
  @MaxLength(100)
  operMethod: string

  /** 主机地址 */
  @IsOptional()
  @MaxLength(128)
  operIp: string

  /** 操作地点 */
  @IsOptional()
  @MaxLength(255)
  operLocation: string

  /** 操作状态(enum OperStatus) */
  @IsOptional()
  @IsInt()
  operStatus: OperStatus

  /** 请求URL */
  @IsOptional()
  @MaxLength(255)
  requestUrl: string

  /** 请求方式 */
  @IsOptional()
  @MaxLength(10)
  requestMethod: string

  /** 请求参数 */
  @IsOptional()
  @MaxLength(2000)
  requestParam: string

  /** 请求返回参数 */
  @IsOptional()
  @MaxLength(2000)
  requestResult: string

  /** 请求错误消息 */
  @IsOptional()
  @MaxLength(2000)
  requestErrmsg: string
}
