import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { ListGenDto, UpdateGenDto } from './dto/gen.dto'
import { GenService } from './gen.service'

/**
 * 代码生成
 * @author vivy
 */
@ApiTags('代码生成')
@ApiBearerAuth()
@Controller()
export class GenController {
  constructor(private genService: GenService) {}

  /**
   * 代码生成列表
   * @param gen 搜索信息
   * @returns 代码生成列表
   */
  @Get('list')
  async list(@Query() gen: ListGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.list(gen))
  }

  /**
   * 更新代码生成
   * @param gen 更新信息
   */
  @Put('update')
  @Log({ title: '代码生成', operType: OperType.UPDATE })
  async update(@Body() gen: UpdateGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.update(gen))
  }

  /**
   * 删除代码生成
   * @param tableIds 代码生成ID
   */
  @Delete('delete/:tableIds')
  @Log({ title: '代码生成', operType: OperType.DELETE })
  async delete(@Param('tableIds', new ParseArrayPipe({ items: Number })) tableIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.delete(tableIds))
  }

  /**
   * 代码生成详情
   * @param tableId 代码生成ID
   * @returns 代码生成详情
   */
  @Get('info/:tableId')
  async info(@Param('tableId') tableId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.info(tableId))
  }

  /**
   * 查询数据库表列表
   * @param tableId 代码生成ID
   * @returns 数据库表列表
   */
  @Get('dblist')
  async dblist(@Query() gen: ListGenDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.dblist(gen))
  }

  /**
   * 导入表结构到代码生成表
   * @param tableNames 表名称
   */
  @Post('import/:tableNames')
  @Log({ title: '代码生成', operType: OperType.INSERT })
  async import(@Param('tableNames', new ParseArrayPipe()) tableNames: string[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.import(tableNames))
  }

  /**
   * 同步表结构到代码生成表
   * @param tableName 表名称
   */
  @Put('sync/:tableName')
  @Log({ title: '代码生成', operType: OperType.INSERT })
  async sync(@Param('tableName') tableName: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.sync(tableName))
  }

  /**
   * 预览代码
   * @param tableName 表名称
   * @returns 代码详情
   */
  @Get('preview/:tableName')
  async preview(@Param('tableName') tableName: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.preview(tableName))
  }

  /**
   * 下载代码
   * @param tableName 表名称
   * @returns 代码详情
   */
  @Get('download/:tableName')
  async download(@Param('tableName') tableName: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.genService.download(tableName))
  }
}
