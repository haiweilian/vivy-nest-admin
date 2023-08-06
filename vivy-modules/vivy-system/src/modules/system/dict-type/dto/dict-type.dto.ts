import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysDictType } from '../entities/sys-dict-type.entity'

/**
 * 列表
 */
export class ListDictTypeDto extends PaginateDto {
  /** 字典名称 */
  @Allow()
  dictName?: string = ''

  /** 字典类型 */
  @Allow()
  dictType?: string = ''

  /** 字典状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 新增
 */
export class CreateDictTypeDto extends OmitType(SysDictType, ['dictId'] as const) {}

/**
 * 更新
 */
export class UpdateDictTypeDto extends SysDictType {}
