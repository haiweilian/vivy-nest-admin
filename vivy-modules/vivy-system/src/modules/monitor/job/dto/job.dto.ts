import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysJob } from '../entities/sys-job.entity'

/**
 * 查询定时任务
 */
export class ListJobDto extends PaginateDto {
  /** 任务名称 */
  @Allow()
  jobName?: string

  /** 任务组名 */
  @Allow()
  jobGroup?: string

  /** 调用目标 */
  @Allow()
  invokeTarget?: string

  /** 状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加定时任务
 */
export class CreateJobDto extends OmitType(SysJob, ['jobId'] as const) {}

/**
 * 更新定时任务
 */
export class UpdateJobDto extends OmitType(SysJob, [] as const) {}
