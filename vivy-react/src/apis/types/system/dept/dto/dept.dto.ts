// import { IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { PartialType } from '@nestjs/mapped-types'

/**
 * 新增
 */
export interface CreateDeptDto {
  /** 父部门ID */
  // @IsOptional()
  // @IsInt()
  parentId: number

  /** 部门名称 */
  // @IsNotEmpty()
  // @MaxLength(50)
  deptName: string

  /** 显示顺序 */
  // @IsOptional()
  // @IsInt()
  deptSort: number

  /** 部门状态（0正常 1停用） */
  // @IsOptional()
  // @MaxLength(1)
  status: string

  /** 备注 */
  // @IsOptional()
  // @MaxLength(500)
  remark: string
}

/**
 * 更新
 */
export interface UpdateDeptDto extends Partial<CreateDeptDto> {
  /** 部门ID */
  // @IsNotEmpty()
  // @IsInt()
  deptId: number
}
