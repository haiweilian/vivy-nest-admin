import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ConfigService } from './config.service'
import { ListConfigDto, CreateConfigDto, UpdateConfigDto } from './dto/config.dto'

/**
 * 参数配置
 * @author vivy
 */
@ApiTags('参数配置')
@ApiBearerAuth()
@Controller('configs')
export class ConfigController {
  constructor(
    private configService: ConfigService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 参数配置列表
   * @param config 参数配置信息
   * @returns 参数配置列表
   */
  @Get()
  @RequirePermissions('system:config:list')
  async list(@Query() config: ListConfigDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.list(config))
  }

  /**
   * 添加参数配置
   * @param config 参数配置信息
   */
  @Post()
  @Log({ title: '参数配置', operType: OperType.INSERT })
  @RequirePermissions('system:config:add')
  async add(@Body() config: CreateConfigDto): Promise<AjaxResult> {
    if (!(await this.configService.checkConfigKeyUnique(config.configKey))) {
      return AjaxResult.error(`新增参数配置${config.configName}失败，参数键名已存在`)
    }

    config.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.configService.add(config))
  }

  /**
   * 更新参数配置
   * @param configId 参数配置ID
   * @param config 参数配置信息
   */
  @Put(':configId')
  @Log({ title: '参数配置', operType: OperType.UPDATE })
  @RequirePermissions('system:config:update')
  async update(@Param('configId') configId: number, @Body() config: UpdateConfigDto): Promise<AjaxResult> {
    if (!(await this.configService.checkConfigKeyUnique(config.configKey, configId))) {
      return AjaxResult.error(`修改参数配置${config.configName}失败，参数键名已存在`)
    }

    config.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.configService.update(configId, config))
  }

  /**
   * 删除参数配置
   * @param configIds 参数配置ID
   */
  @Delete(':configIds')
  @Log({ title: '参数配置', operType: OperType.DELETE })
  @RequirePermissions('system:config:delete')
  async delete(@Param('configIds', new ParseArrayPipe({ items: Number })) configIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.delete(configIds))
  }

  /**
   * 参数配置详情
   * @param configId 参数配置ID
   * @returns 参数配置详情
   */
  @Get(':configId')
  @RequirePermissions('system:config:query')
  async info(@Param('configId') configId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.info(configId))
  }

  /**
   * 获取参数配置值
   * @param configKey 参数配置键名
   * @returns 参数配置键值
   */
  @Get(':configKey/value')
  @RequirePermissions('system:config:query')
  async value(@Param('configKey') configKey: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.configService.value(configKey))
  }
}
