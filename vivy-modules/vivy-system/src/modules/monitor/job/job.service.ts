import { Injectable } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnums, ServiceException } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Repository } from 'typeorm'
import { ListJobLogDto, CreateJobLogDto } from './dto/job-log.dto'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { SysJobLog } from './entities/sys-job-log.entity'
import { SysJob } from './entities/sys-job.entity'
import { JobQueue } from './job.queue'
import { TASKABLE_METADATA } from './utils/job.constants'

/**
 * 定时任务
 * @author vivy
 */
@Injectable()
export class JobService {
  constructor(
    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private jobQueue: JobQueue,

    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysJob)
    private jobRepository: Repository<SysJob>,

    @InjectRepository(SysJobLog)
    private jobLogRepository: Repository<SysJobLog>
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
    if (res.status === BaseStatusEnums.NORMAL) {
      await this.jobQueue.start(res)
    }
  }

  /**
   * 更新定时任务
   * @param job 定时任务信息
   */
  async update(job: UpdateJobDto): Promise<void> {
    const res = await this.jobRepository.save(job)
    if (res.status === BaseStatusEnums.NORMAL) {
      await this.jobQueue.stop(res)
      await this.jobQueue.start(res)
    } else {
      await this.jobQueue.stop(res)
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
      await Promise.all(jobs.map((job) => this.jobQueue.stop(job)))
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
    const job = await this.info(jobId)
    await this.jobQueue.once(job)
  }

  /**
   * 添加任务日志
   * @param jobLog 任务日志详情
   */
  async addJobLog(jobLog: CreateJobLogDto) {
    await this.jobLogRepository.insert(jobLog)
  }

  /**
   * 查询任务日志列表
   * @param jobLog 任务日志信息
   * @returns 任务日志列表
   */
  async listJobLog(jobLog: ListJobLogDto): Promise<Pagination<SysJobLog>> {
    return paginate<SysJobLog>(
      this.jobLogRepository,
      {
        page: jobLog.page,
        limit: jobLog.limit,
      },
      {
        where: {
          jobId: jobLog.jobId,
          jobName: isNotEmpty(jobLog.jobName) ? Like(`%${jobLog.jobName}%`) : undefined,
          jobGroup: jobLog.jobGroup,
          invokeTarget: jobLog.invokeTarget,
          status: jobLog.status,
        },
      }
    )
  }

  /**
   * 清空任务日志列表
   */
  async clearJobLog(): Promise<void> {
    await this.jobLogRepository.clear()
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
      throw new ServiceException('调用目标未添加@Taskable注解')
    }
  }
}
