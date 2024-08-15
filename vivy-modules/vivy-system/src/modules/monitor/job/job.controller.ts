import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto'
import { JobService } from './job.service'

/**
 * 定时任务
 * @author vivy
 */
@ApiTags('定时任务')
@ApiBearerAuth()
@Controller('jobs')
export class JobController {
  constructor(
    private jobService: JobService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 定时任务列表
   * @param job 定时任务信息
   * @returns 定时任务列表
   */
  @Get()
  @RequirePermissions('monitor:job:list')
  async list(@Query() job: ListJobDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.list(job))
  }

  /**
   * 添加定时任务
   * @param job 定时任务信息
   */
  @Post()
  @Log({ title: '定时任务', operType: OperType.INSERT })
  @RequirePermissions('monitor:job:add')
  async add(@Body() job: CreateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)

    job.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.jobService.add(job))
  }

  /**
   * 更新定时任务
   * @param jobId 定时任务ID
   * @param job 定时任务信息
   */
  @Put(':jobId')
  @Log({ title: '定时任务', operType: OperType.UPDATE })
  @RequirePermissions('monitor:job:update')
  async update(@Param('jobId') jobId: number, @Body() job: UpdateJobDto): Promise<AjaxResult> {
    await this.jobService.checkInvokeTargetAllowed(job.invokeTarget)

    job.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.jobService.update(jobId, job))
  }

  /**
   * 删除定时任务
   * @param jobIds 定时任务ID
   */
  @Delete(':jobIds')
  @Log({ title: '定时任务', operType: OperType.DELETE })
  @RequirePermissions('monitor:job:delete')
  async delete(@Param('jobIds', new ParseArrayPipe({ items: Number })) jobIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.delete(jobIds))
  }

  /**
   * 定时任务详情
   * @param jobId 定时任务ID
   * @returns 定时任务详情
   */
  @Get(':jobId')
  @RequirePermissions('monitor:job:query')
  async info(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.info(jobId))
  }

  /**
   * 执行一次定时任务
   * @param jobId 定时任务ID
   */
  @Post(':jobId/once')
  @RequirePermissions('monitor:job:add')
  @Log({ title: '定时任务', operType: OperType.INSERT })
  async once(@Param('jobId') jobId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.jobService.once(jobId))
  }
}
