import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import { CreateJobParams, ListJobParams, UpdateJobParams, JobModel, JobLogModel, ListJobLogParams } from './model'
export * from './model'

/**
 * 查询定时任务列表
 */
export function listJob(params: ListJobParams) {
  return request<Pagination<JobModel>>(`/jobs`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加定时任务
 */
export function addJob(params: CreateJobParams) {
  return request(`/jobs`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新定时任务
 */
export function updateJob(jobId: number, params: UpdateJobParams) {
  return request(`/jobs/${jobId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除定时任务
 */
export function deleteJob(jobIds: number | string) {
  return request(`/jobs/${jobIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询定时任务详情
 */
export function infoJob(jobId: number) {
  return request<JobModel>(`/jobs/${jobId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 执行一次定时任务
 */
export function onceJob(jobId: number) {
  return request<JobModel>(`/jobs/${jobId}/once`, {
    method: RequestEnum.POST,
  })
}

/**
 * 查询任务日志列表
 */
export function listJobLog(params: ListJobLogParams) {
  return request<Pagination<JobLogModel>>(`/job/logs`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 清空任务日志列表
 */
export function clearJobLog() {
  return request(`/job/logs/clear`, {
    method: RequestEnum.DELETE,
  })
}
