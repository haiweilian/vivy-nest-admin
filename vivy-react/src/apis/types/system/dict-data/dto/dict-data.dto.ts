// import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { PaginateDto } from '@vivy-cloud/common-core'
import { PaginateDto } from '@/apis/types/dto'

/**
 * 列表
 */
export interface ListDictDataDto extends PaginateDto {
  /** 字典类型 */
  // @Allow()
  dictType: string

  /** 字典标签 */
  // @Allow()
  dictLabel: string

  /** 字典状态（0正常 1停用） */
  // @Allow()
  status: string
}

/**
 * 新增
 */
export interface CreateDictDataDto {
  /** 字典类型 */
  // @IsNotEmpty()
  // @MaxLength(100)
  dictType: string

  /** 字典标签 */
  // @IsNotEmpty()
  // @MaxLength(100)
  dictLabel: string

  /** 字典键值 */
  // @IsNotEmpty()
  // @MaxLength(100)
  dictValue: string

  /** 显示顺序 */
  // @IsOptional()
  // @IsInt()
  dictSort: number

  /** 字典状态（0正常 1停用） */
  // @IsOptional()
  // @MaxLength(1)
  status: string

  /** 样式属性（其他样式扩展） */
  // @IsOptional()
  // @MaxLength(100)
  cssClass: string

  /** 表格回显样式 */
  // @IsOptional()
  // @MaxLength(100)
  listClass: string

  /** 备注 */
  // @IsOptional()
  // @MaxLength(500)
  remark: string
}

/**
 * 更新
 */
export interface UpdateDictDataDto extends CreateDictDataDto {
  /** 字典ID */
  // @IsNotEmpty()
  // @IsInt()
  dictId: number
}
