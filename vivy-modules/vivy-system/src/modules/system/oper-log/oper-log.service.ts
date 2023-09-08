import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isArray, isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Between, Like, Repository } from 'typeorm'
import { ListOperLogDto, CreateOperLogDto } from './dto/oper-log.dto'
import { SysOperLog } from './entities/sys-oper-log.entity'

/**
 * 操作日志
 * @author vivy
 */
@Injectable()
export class OperLogService {
  constructor(
    @InjectRepository(SysOperLog)
    private operLogRepository: Repository<SysOperLog>
  ) {}

  /**
   * 操作日志列表
   * @param operLog 操作日志信息
   * @returns 操作日志列表
   */
  async list(operLog: ListOperLogDto): Promise<Pagination<SysOperLog>> {
    return paginate<SysOperLog>(
      this.operLogRepository,
      {
        page: operLog.page,
        limit: operLog.limit,
      },
      {
        order: {
          createTime: 'DESC',
        },
        where: {
          operType: operLog.operType,
          operStatus: operLog.operStatus,
          title: isNotEmpty(operLog.title) ? Like(`%${operLog.title}%`) : undefined,
          operName: isNotEmpty(operLog.operName) ? Like(`%${operLog.operName}%`) : undefined,
          requestUrl: isNotEmpty(operLog.requestUrl) ? Like(`%${operLog.requestUrl}%`) : undefined,
          createTime: isArray(operLog.createTime) ? Between(operLog.createTime[0], operLog.createTime[1]) : undefined,
        },
      }
    )
  }

  /**
   * 添加操作日志
   * @param operLog 操作日志信息
   */
  async add(operLog: CreateOperLogDto): Promise<void> {
    await this.operLogRepository.insert(operLog)
  }

  /**
   * 清空操作日志
   */
  async clear(): Promise<void> {
    await this.operLogRepository.clear()
  }
}
