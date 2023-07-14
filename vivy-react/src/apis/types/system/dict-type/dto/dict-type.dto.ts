// import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { PaginateDto } from '@vivy-cloud/common-core'
import { PaginateDto } from '@/apis/types/dto';

/**
 * 列表
 */
export interface ListDictTypeDto extends PaginateDto {
  /** 字典名称 */
  // @Allow()
  dictName: string;

  /** 字典类型 */
  // @Allow()
  dictType: string;

  /** 字典状态（0正常 1停用） */
  // @Allow()
  status: string;
}

/**
 * 新增
 */
export interface CreateDictTypeDto {
  /** 字典名称 */
  // @IsNotEmpty()
  // @MaxLength(50)
  dictName: string;

  /** 字典类型 */
  // @IsNotEmpty()
  // @MaxLength(100)
  dictType: string;

  /** 显示顺序 */
  // @IsOptional()
  // @IsInt()
  dictSort: number;

  /** 字典状态（0正常 1停用） */
  // @IsOptional()
  // @MaxLength(1)
  status: string;

  /** 备注 */
  // @IsOptional()
  // @MaxLength(500)
  remark: string;
}

/**
 * 更新
 */
export interface UpdateDictTypeDto extends CreateDictTypeDto {
  /** 字典ID */
  // @IsNotEmpty()
  // @IsInt()
  dictId: number;
}
