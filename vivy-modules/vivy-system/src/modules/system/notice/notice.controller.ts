import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListNoticeDto, CreateNoticeDto, UpdateNoticeDto } from './dto/notice.dto'
import { NoticeService } from './notice.service'

/**
 * 通知公告
 * @author vivy
 */
@ApiTags('通知公告')
@ApiBearerAuth()
@Controller('notices')
export class NoticeController {
  constructor(
    private noticeService: NoticeService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 通知公告列表
   * @param notice 通知公告信息
   * @returns 通知公告列表
   */
  @Get()
  @RequirePermissions('system:notice:list')
  async list(@Query() notice: ListNoticeDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.list(notice))
  }

  /**
   * 添加通知公告
   * @param notice 通知公告信息
   */
  @Post()
  @Log({ title: '通知公告', operType: OperType.INSERT })
  @RequirePermissions('system:notice:add')
  async add(@Body() notice: CreateNoticeDto): Promise<AjaxResult> {
    notice.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.noticeService.add(notice))
  }

  /**
   * 更新通知公告
   * @param noticeId 通知公告ID
   * @param notice 通知公告信息
   */
  @Put(':noticeId')
  @Log({ title: '通知公告', operType: OperType.UPDATE })
  @RequirePermissions('system:notice:update')
  async update(@Param('noticeId') noticeId: number, @Body() notice: UpdateNoticeDto): Promise<AjaxResult> {
    notice.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.noticeService.update(noticeId, notice))
  }

  /**
   * 删除通知公告
   * @param noticeIds 通知公告ID
   */
  @Delete(':noticeIds')
  @Log({ title: '通知公告', operType: OperType.DELETE })
  @RequirePermissions('system:notice:delete')
  async delete(@Param('noticeIds', new ParseArrayPipe({ items: Number })) noticeIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.delete(noticeIds))
  }

  /**
   * 通知公告详情
   * @param noticeId 通知公告ID
   * @returns 通知公告详情
   */
  @Get(':noticeId')
  @RequirePermissions('system:notice:query')
  async info(@Param('noticeId') noticeId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.noticeService.info(noticeId))
  }
}
