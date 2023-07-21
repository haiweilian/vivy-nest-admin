import { PaginateDto } from '@vivy-common/core'
import { LoginType, OperStatus } from '@vivy-common/logger'
import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 列表
 */
export class ListLoginLogDto extends PaginateDto {
  /** 用户账号 */
  @Allow()
  loginName: string = ''

  /** 登录状态(enum OperStatus) */
  @Allow()
  loginStatus: OperStatus

  /** 登录时间 */
  @Allow()
  createTime: string[]
}

/**
 * 新增
 */
export class CreateLoginLogDto {
  /** 用户账号 */
  @IsNotEmpty()
  @MaxLength(50)
  loginName: string

  /** 登录类型(enum LoginType) */
  @IsOptional()
  @IsInt()
  loginType: LoginType

  /** 登录状态(enum OperStatus) */
  @IsOptional()
  @IsInt()
  loginStatus: OperStatus

  /** 主机地址 */
  @IsOptional()
  @MaxLength(128)
  loginIp: string

  /** 登录地点 */
  @IsOptional()
  @MaxLength(255)
  loginLocation: string

  /** 登录信息 */
  @IsOptional()
  @MaxLength(255)
  loginMessage: string

  /** 用户代理 */
  @IsOptional()
  @MaxLength(500)
  userAgent: string
}
