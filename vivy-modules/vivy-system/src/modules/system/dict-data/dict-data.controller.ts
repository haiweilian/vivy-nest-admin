import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DictDataService } from './dict-data.service'
import { ListDictDataDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict-data.dto'

/**
 * 字典数据管理
 * @author vivy
 */
@ApiTags('字典数据管理')
@ApiBearerAuth()
@Controller('dict/data')
export class DictDataController {
  constructor(
    private dictDataService: DictDataService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 查询字典数据列表
   * @author vivy
   * @param dictData 字典数据信息
   * @returns 字典数据列表
   */
  @Get('list')
  @RequirePermissions('system:dict:list')
  async list(@Query() dictData: ListDictDataDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.list(dictData))
  }

  /**
   * 添加字典数据
   * @param dictData 字典数据信息
   */
  @Post('add')
  @Log({ title: '字典数据管理', operType: OperType.INSERT })
  @RequirePermissions('system:dict:add')
  async add(@Body() dictData: CreateDictDataDto): Promise<AjaxResult> {
    if (!(await this.dictDataService.checkDictLabelUnique(dictData))) {
      return AjaxResult.error(`新增字典${dictData.dictLabel}失败，字典标签已存在`)
    }

    if (!(await this.dictDataService.checkDictValueUnique(dictData))) {
      return AjaxResult.error(`新增字典${dictData.dictLabel}失败，字典键值已存在`)
    }

    dictData.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictDataService.add(dictData))
  }

  /**
   * 更新字典数据
   * @param dictData 字典数据信息
   */
  @Put('update')
  @Log({ title: '字典数据管理', operType: OperType.UPDATE })
  @RequirePermissions('system:dict:update')
  async update(@Body() dictData: UpdateDictDataDto): Promise<AjaxResult> {
    if (!(await this.dictDataService.checkDictLabelUnique(dictData))) {
      return AjaxResult.error(`修改字典${dictData.dictLabel}失败，字典标签已存在`)
    }

    if (!(await this.dictDataService.checkDictValueUnique(dictData))) {
      return AjaxResult.error(`修改字典${dictData.dictLabel}失败，字典键值已存在`)
    }

    dictData.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictDataService.update(dictData))
  }

  /**
   * 删除字典数据
   * @param dictIds 字典数据ID
   */
  @Delete('delete/:dictIds')
  @Log({ title: '字典数据管理', operType: OperType.DELETE })
  @RequirePermissions('system:dict:delete')
  async delete(@Param('dictIds', ParseArrayPipe) dictIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.delete(dictIds))
  }

  /**
   * 字典数据详情
   * @param dictId 字典数据ID
   * @returns 字典数据详情
   */
  @Get('info/:dictId')
  @RequirePermissions('system:dict:query')
  async info(@Param('dictId') dictId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.info(dictId))
  }

  /**
   * 根据字典类型查询字典数据选项列表
   * @param dictType 字典类型
   * @returns 字典数据选项列表
   */
  @Get('option/:dictType')
  async optionList(@Param('dictType') dictType: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictDataService.optionList(dictType))
  }
}
