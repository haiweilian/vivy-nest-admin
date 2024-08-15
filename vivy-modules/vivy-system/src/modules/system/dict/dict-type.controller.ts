import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DictTypeService } from './dict-type.service'
import { ListDictTypeDto, CreateDictTypeDto, UpdateDictTypeDto } from './dto/dict-type.dto'

/**
 * 字典类型管理
 * @author vivy
 */
@ApiTags('字典类型管理')
@ApiBearerAuth()
@Controller('dict/types')
export class DictTypeController {
  constructor(
    private dictTypeService: DictTypeService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 查询字典类型列表
   * @param dictType 字典类型信息
   * @returns 字典类型列表
   */
  @Get()
  @RequirePermissions('system:dict:list')
  async list(@Query() dictType: ListDictTypeDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.list(dictType))
  }

  /**
   * 添加字典类型
   * @param dictType 字典类型信息
   */
  @Post()
  @Log({ title: '字典类型管理', operType: OperType.INSERT })
  @RequirePermissions('system:dict:add')
  async add(@Body() dictType: CreateDictTypeDto): Promise<AjaxResult> {
    if (!(await this.dictTypeService.checkDictTypeUnique(dictType.dictType))) {
      return AjaxResult.error(`新增字典${dictType.dictName}失败，字典类型已存在`)
    }

    if (!(await this.dictTypeService.checkDictNameUnique(dictType.dictName))) {
      return AjaxResult.error(`新增字典${dictType.dictName}失败，字典名称已存在`)
    }

    dictType.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictTypeService.add(dictType))
  }

  /**
   * 更新字典类型
   * @param dictId 字典类型ID
   * @param dictType 字典类型信息
   */
  @Put(':dictId')
  @Log({ title: '字典类型管理', operType: OperType.UPDATE })
  @RequirePermissions('system:dict:update')
  async update(@Param('dictId') dictId: number, @Body() dictType: UpdateDictTypeDto): Promise<AjaxResult> {
    if (!(await this.dictTypeService.checkDictTypeUnique(dictType.dictType, dictId))) {
      return AjaxResult.error(`修改字典${dictType.dictName}失败，字典类型已存在`)
    }

    if (!(await this.dictTypeService.checkDictNameUnique(dictType.dictName, dictId))) {
      return AjaxResult.error(`修改字典${dictType.dictName}失败，字典名称已存在`)
    }

    dictType.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.dictTypeService.update(dictId, dictType))
  }

  /**
   * 删除字典类型
   * @param dictIds 字典类型ID
   */
  @Delete(':dictIds')
  @Log({ title: '字典类型管理', operType: OperType.DELETE })
  @RequirePermissions('system:dict:delete')
  async delete(@Param('dictIds', new ParseArrayPipe({ items: Number })) dictIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.delete(dictIds))
  }

  /**
   * 字典类型选项列表
   * @returns 字典类型选项列表
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.options())
  }

  /**
   * 字典类型详情
   * @param dictId 字典类型ID
   * @returns 字典类型详情
   */
  @Get(':dictId')
  @RequirePermissions('system:dict:query')
  async info(@Param('dictId') dictId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.dictTypeService.info(dictId))
  }
}
