import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Between, Like, Repository } from 'typeorm'
import { UAParser } from 'ua-parser-js'
import { SysLoginLog } from '@/entities/sys-login-log.entity'
import { ListLoginLogDto, CreateLoginLogDto } from './dto/login-log.dto'
import { ListLoginLogVo } from './vo/login-log.vo'

/**
 * 登录日志
 * @author vivy
 */
@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(SysLoginLog)
    private loginLogRepository: Repository<SysLoginLog>
  ) {}

  /**
   * 查询登录日志列表
   * @param loginLog 登录日志信息
   * @returns 登录日志列表
   */
  async list(loginLog: ListLoginLogDto): Promise<Pagination<ListLoginLogVo>> {
    const list = await paginate<SysLoginLog>(
      this.loginLogRepository,
      {
        page: loginLog.page,
        limit: loginLog.limit,
      },
      {
        order: {
          createdTime: 'DESC',
        },
        where: {
          loginName: Like(`%${loginLog.loginName}%`),
          loginStatus: loginLog.loginStatus,
          createdTime: loginLog.createdTime ? Between(loginLog.createdTime[0], loginLog.createdTime[1]) : undefined,
        },
      }
    )

    return {
      meta: list.meta,
      items: list.items.map((item) => {
        const parser = new UAParser(item.userAgent)
        return {
          ...item,
          os: `${parser.getOS().name}/${parser.getOS().version}`,
          browser: `${parser.getBrowser().name}/${parser.getBrowser().version}`,
        }
      }),
    }
  }

  /**
   * 添加登录日志
   * @param loginLog 登录日志信息
   */
  async add(loginLog: CreateLoginLogDto): Promise<void> {
    await this.loginLogRepository.insert(loginLog)
  }

  /**
   * 清空登录日志
   */
  async clear(): Promise<void> {
    await this.loginLogRepository.clear()
  }
}
