import { PaginateDto } from '@vivy-common/core'
import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 列表
 */
export class ListDictTypeDto extends PaginateDto {
  /** 字典名称 */
  @Allow()
  dictName: string = ''

  /** 字典类型 */
  @Allow()
  dictType: string = ''

  /** 字典状态（0正常 1停用） */
  @Allow()
  status: string
}

/**
 * 新增
 */
export class CreateDictTypeDto {
  /** 字典名称 */
  @IsNotEmpty()
  @MaxLength(50)
  dictName: string

  /** 字典类型 */
  @IsNotEmpty()
  @MaxLength(100)
  dictType: string

  /** 显示顺序 */
  @IsOptional()
  @IsInt()
  dictSort: number

  /** 字典状态（0正常 1停用） */
  @IsOptional()
  @MaxLength(1)
  status: string

  /** 备注 */
  @IsOptional()
  @MaxLength(500)
  remark: string
}

/**
 * 更新
 */
export class UpdateDictTypeDto extends CreateDictTypeDto {
  /** 字典ID */
  @IsNotEmpty()
  @IsInt()
  dictId: number
}
