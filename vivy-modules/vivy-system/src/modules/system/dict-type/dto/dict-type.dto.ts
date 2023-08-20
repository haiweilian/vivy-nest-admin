import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysDictType } from '../entities/sys-dict-type.entity'

/**
 * 查询字典类型
 */
export class ListDictTypeDto extends PaginateDto {
  /** 字典名称 */
  @Allow()
  dictName?: string

  /** 字典类型 */
  @Allow()
  dictType?: string

  /** 字典状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加字典类型
 */
export class CreateDictTypeDto extends OmitType(SysDictType, ['dictId'] as const) {}

/**
 * 更新字典类型
 */
export class UpdateDictTypeDto extends OmitType(SysDictType, [] as const) {}
