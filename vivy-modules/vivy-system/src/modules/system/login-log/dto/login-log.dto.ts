import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysLoginLog } from '../entities/sys-login-log.entity'

/**
 * 列表
 */
export class ListLoginLogDto extends PaginateDto {
  /** 用户账号 */
  @Allow()
  loginName?: string = ''

  /** 登录状态(enum OperStatus) */
  @Allow()
  loginStatus?: number

  /** 登录时间 */
  @Allow()
  createTime?: string[]
}

/**
 * 新增
 */
export class CreateLoginLogDto extends OmitType(SysLoginLog, ['loginId'] as const) {}
