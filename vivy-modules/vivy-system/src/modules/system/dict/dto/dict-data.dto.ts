import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysDictData } from '../entities/sys-dict-data.entity'

/**
 * 查询字典数据
 */
export class ListDictDataDto extends PaginateDto {
  /** 字典类型 */
  @Allow()
  dictType?: string

  /** 字典标签 */
  @Allow()
  dictLabel?: string

  /** 字典状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加字典数据
 */
export class CreateDictDataDto extends OmitType(SysDictData, ['dictId'] as const) {}

/**
 * 更新字典数据
 */
export class UpdateDictDataDto extends OmitType(SysDictData, ['dictId'] as const) {}
