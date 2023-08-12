import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { GenTable } from '../entities/gen-table.entity'

/**
 * 查询代码生成
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
 * 添加代码生成
 */
export class CreateGenDto extends OmitType(GenTable, ['tableId'] as const) {}

/**
 * 更新代码生成
 */
export class UpdateGenDto extends OmitType(GenTable, [] as const) {}
