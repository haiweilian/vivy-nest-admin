/**
 * 定时任务信息
 */
export interface JobModel {
  /** 任务ID */
  jobId: number

  /** 任务名称 */
  jobName: string

  /** 任务组名 */
  jobGroup: string

  /** 调用目标 */
  invokeTarget: string

  /** 调用参数 */
  invokeParams: string

  /** Cron表达式 */
  cronExpression: string

  /** 状态（0正常 1停用） */
  status: string

  /** 备注 */
  remark: string
}

/**
 * 查询定时任务
 */
export interface ListJobParams extends PaginateParams {
  /** 任务名称 */
  jobName?: string

  /** 任务组名 */
  jobGroup?: string

  /** 调用目标 */
  invokeTarget?: string

  /** 状态（0正常 1停用） */
  status?: string
}

/**
 * 添加定时任务
 */
export type CreateJobParams = Omit<JobModel, 'jobId'>

/**
 * 更新定时任务
 */
export type UpdateJobParams = JobModel

/**
 * 任务日志信息
 */
export interface JobLogModel {
  /** 任务日志ID */
  jobLogId: number

  /** 任务ID */
  jobId: string

  /** 任务名称 */
  jobName: string

  /** 任务组名 */
  jobGroup: string

  /** 调用目标 */
  invokeTarget: string

  /** 调用参数 */
  invokeParams: string

  /** 调用信息 */
  invokeMessage: string

  /** 异常信息 */
  exceptionMessage: string

  /** 状态（0成功 1失败） */
  status: string
}

/**
 * 查询任务日志
 */
export interface ListJobLogParams extends PaginateParams {
  /** 任务ID */
  jobId?: string

  /** 任务名称 */
  jobName?: string

  /** 任务组名 */
  jobGroup?: string

  /** 调用目标 */
  invokeTarget?: string

  /** 状态（0成功 1失败） */
  status?: string
}

/**
 * 添加任务日志
 */
export type CreateJobLogParams = Omit<JobLogModel, 'jobLogId'>

/**
 * 更新任务日志
 */
export type UpdateJobLogParams = JobLogModel
