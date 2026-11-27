import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { CreateModelDto, ListModelDto, TestModelDto, UpdateModelDto, UpdateModelStatusDto } from './dto/model.dto.js'
import { ModelService } from './model.service.js'
import { ModelTestMode } from './model.types.js'

/**
 * AI模型管理
 */
@ApiTags('AI模型管理')
@ApiBearerAuth()
@Controller('ai/models')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly securityContext: SecurityContext
  ) {}

  /**
   * 模型列表
   * @param query 查询条件
   * @returns 脱敏的模型分页
   */
  @Get()
  @RequirePermissions('ai:model:list')
  async list(@Query() query: ListModelDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.modelService.list(query))
  }

  /**
   * 模型详情
   * @param id 模型ID
   * @returns 脱敏的模型配置
   */
  @Get(':id')
  @RequirePermissions('ai:model:query')
  async info(@Param('id') id: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.modelService.info(id))
  }

  /**
   * 添加模型
   * @param data 模型连接配置
   * @returns 新增模型ID
   */
  @Post()
  @Log({ title: 'AI模型管理', operType: OperType.INSERT, isSaveRequestData: false })
  @RequirePermissions('ai:model:add')
  async add(@Body() data: CreateModelDto): Promise<AjaxResult> {
    data.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.modelService.add(data))
  }

  /**
   * 更新模型
   * @param id 模型ID
   * @param data 需要更新的配置，省略密钥时保留原凭据
   */
  @Put(':id')
  @Log({ title: 'AI模型管理', operType: OperType.UPDATE, isSaveRequestData: false })
  @RequirePermissions('ai:model:update')
  async update(@Param('id') id: string, @Body() data: UpdateModelDto): Promise<AjaxResult> {
    data.updateBy = this.securityContext.getUserName()
    await this.modelService.update(id, data)
    return AjaxResult.success()
  }

  /**
   * 更新模型状态
   * @param id 模型ID
   * @param data 启停状态
   */
  @Put(':id/status')
  @Log({ title: 'AI模型状态', operType: OperType.UPDATE, isSaveRequestData: false })
  @RequirePermissions('ai:model:update')
  async status(@Param('id') id: string, @Body() data: UpdateModelStatusDto): Promise<AjaxResult> {
    await this.modelService.update(id, { status: data.status, updateBy: this.securityContext.getUserName() })
    return AjaxResult.success()
  }

  /**
   * 删除模型配置
   * @param id 模型ID
   */
  @Delete(':id')
  @Log({ title: 'AI模型管理', operType: OperType.DELETE, isSaveRequestData: false })
  @RequirePermissions('ai:model:delete')
  async delete(@Param('id') id: string): Promise<AjaxResult> {
    await this.modelService.delete(id)
    return AjaxResult.success()
  }

  /**
   * 测试已保存的模型连接
   * @param id 模型ID
   * @param data 流式文本或工具调用测试参数
   * @returns 耗时、用量和脱敏的测试结果
   */
  @Post(':id/test')
  @Log({ title: 'AI模型连接测试', operType: OperType.OTHER, isSaveRequestData: false, isSaveResponseData: false })
  @RequirePermissions('ai:model:test')
  async test(@Param('id') id: string, @Body() data: TestModelDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.modelService.test(id, data?.mode ?? ModelTestMode.CHAT))
  }
}
