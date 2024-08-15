import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListJobLogDto, CreateJobLogDto } from './dto/job-log.dto'
import { JobLogService } from './job-log.service'

/**
 * 定时任务日志
 * @author vivy
 */
@ApiTags('定时任务日志')
@ApiBearerAuth()
@Controller('job/logs')
export class JobLogController {
  constructor(private jobLogService: JobLogService) {}

  /**
   * 任务日志列表
   * @param jobLog 任务日志信息
   * @returns 任务日志列表
   */
  @Get()
  @RequirePermissions('monitor:job:list')
  async list(@Query() jobLog: ListJobLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.list(jobLog))
  }

  /**
   * 添加任务日志
   * @param jobLog 任务日志信息
   */
  @Post()
  @Log({ title: '任务日志', operType: OperType.INSERT })
  @RequirePermissions('monitor:job:list')
  async add(@Body() jobLog: CreateJobLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.add(jobLog))
  }

  /**
   * 任务日志详情
   * @param jobLogId 任务日志ID
   * @returns 任务日志详情
   */
  @Get(':jobLogId')
  @RequirePermissions('monitor:job:list')
  async info(@Param('jobLogId') jobLogId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.info(jobLogId))
  }

  /**
   * 清空任务日志列表
   */
  @Delete('clear')
  @RequirePermissions('monitor:job:list')
  async clear(): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobLogService.clear())
  }
}
