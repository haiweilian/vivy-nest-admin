import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateNoticeParams, ListNoticeParams, UpdateNoticeParams, NoticeModel } from './model'
export * from './model'

/**
 * 查询通知公告列表
 */
export function listNotice(params: ListNoticeParams) {
  return request<Pagination<NoticeModel>>('/notice/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加通知公告
 */
export function addNotice(params: CreateNoticeParams) {
  return request('/notice/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新通知公告
 */
export function updateNotice(params: UpdateNoticeParams) {
  return request('/notice/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除通知公告
 */
export function deleteNotice(noticeIds: React.Key) {
  return request(`/notice/delete/${noticeIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询通知公告详情
 */
export function infoNotice(noticeId: React.Key) {
  return request<NoticeModel>(`/notice/info/${noticeId}`, {
    method: RequestEnum.GET,
  })
}
