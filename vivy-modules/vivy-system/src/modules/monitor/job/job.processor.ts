import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { HttpException } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Job as BullJob } from 'bull'
import { JOB_BULL_NAME } from '@/common/constants/bull.constants'
import { SysJobLog } from './entities/sys-job-log.entity'
import { SysJob } from './entities/sys-job.entity'
import { JobService } from './job.service'

@Processor(JOB_BULL_NAME)
export class JobProcessor {
  constructor(
    private moduleRef: ModuleRef,
    private jobService: JobService
  ) {}

  @Process()
  async handle(job: BullJob<SysJob>) {
    const { data } = job
    await this.jobService.checkInvokeTargetAllowed(data.invokeTarget)

    const [className, handleName] = data.invokeTarget.split('.')
    const params = this.safeParse(data.invokeParams)

    const service = await this.moduleRef.get(className, { strict: false })
    await service[handleName](params)
  }

  @OnQueueCompleted()
  async onCompleted(job: BullJob<SysJob>) {
    const { data } = job
    const jobLog = new SysJobLog()
    jobLog.jobId = data.jobId
    jobLog.jobName = data.jobName
    jobLog.jobGroup = data.jobGroup
    jobLog.invokeTarget = data.invokeTarget
    jobLog.invokeParams = data.invokeParams
    jobLog.invokeMessage = '执行成功'
    jobLog.status = '0'
    await this.jobService.addJobLog(jobLog)
  }

  @OnQueueFailed()
  async onFailed(job: BullJob<SysJob>, err: Error | HttpException) {
    const { data } = job
    const jobLog = new SysJobLog()
    jobLog.jobId = data.jobId
    jobLog.jobName = data.jobName
    jobLog.jobGroup = data.jobGroup
    jobLog.invokeTarget = data.invokeTarget
    jobLog.invokeParams = data.invokeParams
    jobLog.invokeMessage = '执行失败'
    jobLog.exceptionMessage = err instanceof HttpException ? JSON.stringify(err.getResponse()) : err.message
    jobLog.status = '1'
    await this.jobService.addJobLog(jobLog)
  }

  private safeParse(params: string): unknown | string {
    try {
      return JSON.parse(params)
    } catch (e) {
      return params
    }
  }
}
