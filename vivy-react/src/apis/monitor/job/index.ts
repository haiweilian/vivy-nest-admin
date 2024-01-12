import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateJobParams, ListJobParams, UpdateJobParams, JobModel, JobLogModel, ListJobLogParams } from './model'
export * from './model'

/**
 * 查询定时任务列表
 */
export function listJob(params: ListJobParams) {
  return request<Pagination<JobModel>>('/job/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加定时任务
 */
export function addJob(params: CreateJobParams) {
  return request('/job/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新定时任务
 */
export function updateJob(params: UpdateJobParams) {
  return request('/job/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除定时任务
 */
export function deleteJob(jobIds: React.Key) {
  return request(`/job/delete/${jobIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询定时任务详情
 */
export function infoJob(jobId: React.Key) {
  return request<JobModel>(`/job/info/${jobId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 执行一次定时任务
 */
export function onceJob(jobId: React.Key) {
  return request<JobModel>(`/job/once/${jobId}`, {
    method: RequestEnum.POST,
  })
}

/**
 * 查询任务日志列表
 */
export function listJobLog(params: ListJobLogParams) {
  return request<Pagination<JobLogModel>>('/job/log/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 清空任务日志列表
 */
export function clearJobLog() {
  return request('/job/log/clear', {
    method: RequestEnum.DELETE,
  })
}
