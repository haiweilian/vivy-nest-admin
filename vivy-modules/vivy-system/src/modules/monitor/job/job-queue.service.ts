import { InjectQueue } from '@nestjs/bull'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum } from '@vivy-common/core'
import { Queue } from 'bull'
import { Repository } from 'typeorm'
import { JOB_BULL_NAME } from '@/common/constants/bull.constants'
import { SysJob } from './entities/sys-job.entity'

/**
 * 定时任务队列
 * @author vivy
 */
@Injectable()
export class JobQueueService implements OnModuleInit {
  constructor(
    @InjectQueue(JOB_BULL_NAME)
    private queue: Queue,

    @InjectRepository(SysJob)
    private jobRepository: Repository<SysJob>
  ) {}

  async onModuleInit() {
    await this.init()
  }

  /**
   * 初始化任务
   */
  async init(): Promise<void> {
    // 停止所有的任务
    const oldJobs = await this.queue.getRepeatableJobs()
    await Promise.all(oldJobs.map((job) => this.queue.removeRepeatableByKey(job.key)))

    // 需要执行的任务
    const newJobs = await this.jobRepository.findBy({ status: BaseStatusEnum.NORMAL })
    await Promise.all(newJobs.map((job) => this.start(job)))
  }

  /**
   * 执行一次
   * @param job
   */
  async once(job: SysJob): Promise<void> {
    await this.queue.add(job, {
      jobId: job.jobId,
      removeOnComplete: true,
      removeOnFail: true,
    })
  }

  /**
   * 启动定时任务
   * @param job
   */
  async start(job: SysJob): Promise<void> {
    await this.queue.add(job, {
      jobId: job.jobId,
      removeOnComplete: true,
      removeOnFail: true,
      repeat: { cron: job.cronExpression },
    })
  }

  /**
   * 停止定时任务
   * @param job
   */
  async stop(job: SysJob): Promise<void> {
    const jobs = await this.queue.getRepeatableJobs()
    const item = jobs.find((item) => item.id === job.jobId.toString())
    if (item) {
      await this.queue.removeRepeatableByKey(item.key)
    }
  }
}
