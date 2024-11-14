import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListJobLogDto, CreateJobLogDto } from './dto/job-log.dto'
import { SysJobLog } from './entities/sys-job-log.entity'

/**
 * 定时任务日志
 * @author vivy
 */
@Injectable()
export class JobLogService {
  constructor(
    @InjectRepository(SysJobLog)
    private jobLogRepository: Repository<SysJobLog>
  ) {}

  /**
   * 任务日志列表
   * @param jobLog 任务日志信息
   * @returns 任务日志列表
   */
  async list(jobLog: ListJobLogDto): Promise<Pagination<SysJobLog>> {
    return paginate<SysJobLog>(
      this.jobLogRepository,
      {
        page: jobLog.page,
        limit: jobLog.limit,
      },
      {
        order: {
          createTime: 'DESC',
        },
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
   * 添加任务日志
   * @param jobLog 任务日志信息
   */
  async add(jobLog: CreateJobLogDto): Promise<void> {
    await this.jobLogRepository.insert(jobLog)
  }

  /**
   * 任务日志详情
   * @param jobLogId 任务日志ID
   * @returns 任务日志详情
   */
  async info(jobLogId: number): Promise<SysJobLog> {
    return this.jobLogRepository.findOneBy({ jobLogId })
  }

  /**
   * 清空任务日志列表
   */
  async clear(): Promise<void> {
    await this.jobLogRepository.clear()
  }
}
