import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { GenTable } from '../entities/gen-table.entity'

/**
 * 列表
 */
export class ListGenDto extends PaginateDto {
  /** 表名称 */
  @Allow()
  tableName?: string = ''

  /** 表注释 */
  @Allow()
  tableComment?: string = ''
}

/**
 * 新增
 */
export class CreateGenDto extends OmitType(GenTable, ['tableId'] as const) {}

/**
 * 更新
 */
export class UpdateGenDto extends GenTable {}
