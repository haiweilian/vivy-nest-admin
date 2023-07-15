import { IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 新增
 */
export class CreateDeptDto {
  /** 父部门ID */
  @IsOptional()
  @IsInt()
  parentId: number = 0

  /** 部门名称 */
  @IsNotEmpty()
  @MaxLength(50)
  deptName: string

  /** 显示顺序 */
  @IsOptional()
  @IsInt()
  deptSort: number

  /** 部门状态（0正常 1停用） */
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
export class UpdateDeptDto extends CreateDeptDto {
  /** 部门ID */
  @IsNotEmpty()
  @IsInt()
  deptId: number
}
