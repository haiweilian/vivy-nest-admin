import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateNoticeParams, ListNoticeParams, UpdateNoticeParams, NoticeModel } from './model'
export * from './model'

/**
 * 查询通知公告列表
 */
export function listNotice(params: ListNoticeParams) {
  return request<Pagination<NoticeModel>>(`/notices`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加通知公告
 */
export function addNotice(params: CreateNoticeParams) {
  return request(`/notices`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新通知公告
 */
export function updateNotice(noticeId: number, params: UpdateNoticeParams) {
  return request(`/notices/${noticeId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除通知公告
 */
export function deleteNotice(noticeIds: number | string) {
  return request(`/notices/${noticeIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询通知公告详情
 */
export function infoNotice(noticeId: number) {
  return request<NoticeModel>(`/notices/${noticeId}`, {
    method: RequestEnum.GET,
  })
}
