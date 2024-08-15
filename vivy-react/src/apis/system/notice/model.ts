/**
 * 通知公告信息
 */
export interface NoticeModel {
  /** 公告ID */
  noticeId: number

  /** 公告标题 */
  noticeTitle: string

  /** 公告类型（1通知 2公告） */
  noticeType: string

  /** 公告内容 */
  noticeContent: string

  /** 公告状态（0正常 1关闭） */
  status: string
}

/**
 * 查询通知公告
 */
export interface ListNoticeParams extends PaginateParams {
  /** 公告标题 */
  noticeTitle?: string

  /** 公告类型（1通知 2公告） */
  noticeType?: string
}

/**
 * 添加通知公告
 */
export type CreateNoticeParams = Omit<NoticeModel, 'noticeId'>

/**
 * 更新通知公告
 */
export type UpdateNoticeParams = Omit<NoticeModel, 'noticeId'>
