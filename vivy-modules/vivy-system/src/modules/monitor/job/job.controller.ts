import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListJobLogDto } from './dto/job-log.dto'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { JobService } from './job.service'

/**
 * 定时任务
 * @author vivy
 */
@ApiTags('定时任务')
@ApiBearerAuth()
@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  /**
   * 定时任务列表
   * @param job 定时任务信息
   * @returns 定时任务列表
   */
  @Get('list')
  @RequirePermissions('monitor:job:list')
  async list(@Query() job: ListJobDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.list(job))
  }

  /**
   * 添加定时任务
   * @param job 定时任务信息
   */
  @Post('add')
  @Log({ title: '定时任务', operType: OperType.INSERT })
  @RequirePermissions('monitor:job:add')
  async add(@Body() job: CreateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)
    return AjaxResult.success(await this.jobService.add(job))
  }

  /**
   * 更新定时任务
   * @param job 定时任务信息
   */
  @Put('update')
  @Log({ title: '定时任务', operType: OperType.UPDATE })
  @RequirePermissions('monitor:job:update')
  async update(@Body() job: UpdateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)
    return AjaxResult.success(await this.jobService.update(job))
  }

  /**
   * 删除定时任务
   * @param jobIds 定时任务ID
   */
  @Delete('delete/:jobIds')
  @Log({ title: '定时任务', operType: OperType.DELETE })
  @RequirePermissions('monitor:job:delete')
  async delete(@Param('jobIds', ParseArrayPipe) jobIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.delete(jobIds))
  }

  /**
   * 定时任务详情
   * @param jobId 定时任务ID
   * @returns 定时任务详情
   */
  @Get('info/:jobId')
  @RequirePermissions('monitor:job:query')
  async info(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.info(jobId))
  }

  /**
   * 执行一次定时任务
   * @param jobId 定时任务ID
   */
  @Post('once/:jobId')
  @RequirePermissions('monitor:job:update')
  @Log({ title: '定时任务', operType: OperType.UPDATE })
  async once(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.once(jobId))
  }

  /**
   * 查询任务日志列表
   * @param jobLog 任务日志信息
   * @returns 任务日志列表
   */
  @Get('log/list')
  async listJobLog(@Query() jobLog: ListJobLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.listJobLog(jobLog))
  }

  /**
   * 清空任务日志列表
   */
  @Delete('log/clear')
  async clearJobLog(): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.clearJobLog())
  }
}
