// import { ApiPropertyOptional } from '@nestjs/swagger'
// import { PaginateDto } from '@vivy-common/core'
// import { Allow, IsArray, IsInt, IsNotEmpty, IsNumberString, IsOptional, MaxLength } from 'class-validator'
// import { GenTableColumn } from '@/entities/gen-table-column.entity'
import { PaginateDto } from '@/apis/types/dto'
import { GenTableColumn } from '../gen-table-column.entity'

/**
 * 列表
 */
export interface ListGenDto extends PaginateDto {
  /** 表名称 */
  // @Allow()
  // @ApiPropertyOptional()
  tableName: string

  /** 表注释 */
  // @Allow()
  // @ApiPropertyOptional()
  tableComment: string
}

/**
 * 新增
 */
export interface CreateGenDto {
  /** 表名称 */
  // @IsNotEmpty()
  // @MaxLength(100)
  tableName: string

  /** 表描述 */
  // @IsOptional()
  // @MaxLength(500)
  tableComment: string

  /** 关联子表的表名 */
  // @IsOptional()
  // @MaxLength(100)
  subTableName: string

  /** 子表关联的外键名 */
  // @IsOptional()
  // @MaxLength(100)
  subTableFkName: string

  /** 实体类名称 */
  // @IsNotEmpty()
  // @MaxLength(100)
  className: string

  /** 生成模板分类 */
  // @IsNotEmpty()
  // @IsNumberString()
  templateCategory: string

  /** 生成业务名 */
  // @IsNotEmpty()
  // @MaxLength(100)
  businessName: string

  /** 生成功能名 */
  // @IsNotEmpty()
  // @MaxLength(100)
  functionName: string

  /** 生成功能作者 */
  // @IsNotEmpty()
  // @MaxLength(100)
  functionAuthor: string

  /** 生成业务表字段 */
  // @IsNotEmpty()
  // @IsArray()
  columns: GenTableColumn[]
}

/**
 * 更新
 */
export interface UpdateGenDto extends CreateGenDto {
  /** 生成表ID */
  // @IsNotEmpty()
  // @IsInt()
  tableId: number
}
