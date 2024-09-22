import { Injectable } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum, ServiceException } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Repository } from 'typeorm'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { SysJob } from './entities/sys-job.entity'
import { JobQueueService } from './job-queue.service'
import { TASKABLE_METADATA } from './utils/job.constants'

/**
 * 定时任务
 * @author vivy
 */
@Injectable()
export class JobService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysJob)
    private jobRepository: Repository<SysJob>,

    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private jobQueueService: JobQueueService
  ) {}

  /**
   * 定时任务列表
   * @param job 定时任务信息
   * @returns 定时任务列表
   */
  async list(job: ListJobDto): Promise<Pagination<SysJob>> {
    return paginate<SysJob>(
      this.jobRepository,
      {
        page: job.page,
        limit: job.limit,
      },
      {
        where: {
          jobName: isNotEmpty(job.jobName) ? Like(`%${job.jobName}%`) : undefined,
          jobGroup: job.jobGroup,
          invokeTarget: job.invokeTarget,
          status: job.status,
        },
      }
    )
  }

  /**
   * 添加定时任务
   * @param job 定时任务信息
   */
  async add(job: CreateJobDto): Promise<void> {
    const res = await this.jobRepository.save(job)
    if (res.status === BaseStatusEnum.NORMAL) {
      await this.jobQueueService.start(res)
    }
  }

  /**
   * 更新定时任务
   * @param jobId 定时任务ID
   * @param job 定时任务信息
   */
  async update(jobId: number, job: UpdateJobDto): Promise<void> {
    await this.jobRepository.update(jobId, job)
    const res = await this.jobRepository.findOneBy({ jobId })
    if (res.status === BaseStatusEnum.NORMAL) {
      await this.jobQueueService.stop(res)
      await this.jobQueueService.start(res)
    } else {
      await this.jobQueueService.stop(res)
    }
  }

  /**
   * 删除定时任务
   * @param jobIds 定时任务ID
   */
  async delete(jobIds: number[]): Promise<void> {
    const jobs = await this.jobRepository.findBy({ jobId: In(jobIds) })
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysJob, jobIds)
      await Promise.all(jobs.map((job) => this.jobQueueService.stop(job)))
    })
  }

  /**
   * 定时任务详情
   * @param jobId 定时任务ID
   * @returns 定时任务详情
   */
  async info(jobId: number): Promise<SysJob> {
    return this.jobRepository.findOneBy({ jobId })
  }

  /**
   * 执行一次定时任务
   * @param jobId 定时任务ID
   */
  async once(jobId: number): Promise<void> {
    const job = await this.jobRepository.findOneBy({ jobId })
    await this.jobQueueService.once(job)
  }

  /**
   * 检测调用目标是否正常
   * @param invokeTarget 调用目标字符串
   * @returns 异常抛出 ServiceException
   */
  async checkInvokeTargetAllowed(invokeTarget: string) {
    // 任务格式是否正确
    const target = invokeTarget.split('.')
    const [className, handleName] = target
    if (target.length !== 2) {
      throw new ServiceException('调用目标不正确')
    }

    // 任务名称是否正确
    let service: any
    try {
      service = await this.moduleRef.get(className, { strict: false })
    } catch {}
    if (!service || typeof service[handleName] !== 'function') {
      throw new ServiceException('调用目标不存在')
    }

    // 是否标记为任务
    const hasTaskable = this.reflector.get<boolean>(TASKABLE_METADATA, service.constructor)
    if (!hasTaskable) {
      throw new ServiceException('调用目标未添加@Taskable装饰器')
    }
  }
}
