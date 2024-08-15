import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListNoticeDto, CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto'
import { SysNotice } from './entities/sys-notice.entity'

/**
 * 通知公告
 * @author vivy
 */
@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(SysNotice)
    private noticeRepository: Repository<SysNotice>
  ) {}

  /**
   * 通知公告列表
   * @param notice 通知公告信息
   * @returns 通知公告列表
   */
  async list(notice: ListNoticeDto): Promise<Pagination<SysNotice>> {
    return paginate<SysNotice>(
      this.noticeRepository,
      {
        page: notice.page,
        limit: notice.limit,
      },
      {
        where: {
          noticeTitle: isNotEmpty(notice.noticeTitle) ? Like(`%${notice.noticeTitle}%`) : undefined,
          noticeType: notice.noticeType,
        },
      }
    )
  }

  /**
   * 添加通知公告
   * @param notice 通知公告信息
   */
  async add(notice: CreateNoticeDto): Promise<void> {
    await this.noticeRepository.insert(notice)
  }

  /**
   * 更新通知公告
   * @param noticeId 通知公告ID
   * @param notice 通知公告信息
   */
  async update(noticeId: number, notice: UpdateNoticeDto): Promise<void> {
    await this.noticeRepository.update(noticeId, notice)
  }

  /**
   * 删除通知公告
   * @param noticeIds 通知公告ID
   */
  async delete(noticeIds: number[]): Promise<void> {
    await this.noticeRepository.delete(noticeIds)
  }

  /**
   * 通知公告详情
   * @param noticeId 通知公告ID
   * @returns 通知公告详情
   */
  async info(noticeId: number): Promise<SysNotice> {
    return this.noticeRepository.findOneBy({ noticeId })
  }
}
