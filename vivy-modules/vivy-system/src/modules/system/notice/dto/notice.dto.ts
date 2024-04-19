import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysNotice } from '../entities/sys-notice.entity'

/**
 * 查询通知公告
 */
export class ListNoticeDto extends PaginateDto {
  /** 公告标题 */
  @Allow()
  noticeTitle?: string

  /** 公告类型（1通知 2公告） */
  @Allow()
  noticeType?: string
}

/**
 * 添加通知公告
 */
export class CreateNoticeDto extends OmitType(SysNotice, ['noticeId'] as const) {}

/**
 * 更新通知公告
 */
export class UpdateNoticeDto extends OmitType(SysNotice, [] as const) {}
