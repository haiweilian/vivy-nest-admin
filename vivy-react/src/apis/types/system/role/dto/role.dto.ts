// import { Allow, IsArray, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginateDto } from '@/apis/types/dto';

/**
 * 列表
 */
export interface ListRoleDto extends PaginateDto {
  /** 角色名称 */
  // @Allow()
  // @ApiPropertyOptional()
  roleName: string;

  /** 角色编码 */
  // @Allow()
  // @ApiPropertyOptional()
  roleCode: string;

  /** 角色状态（0正常 1停用） */
  // @Allow()
  // @ApiPropertyOptional()
  status: string;
}

/**
 * 新增
 */
export interface CreateRoleDto {
  /** 角色名称 */
  // @IsNotEmpty()
  // @MaxLength(50)
  roleName: string;

  /** 角色编码 */
  // @IsNotEmpty()
  // @MaxLength(50)
  roleCode: string;

  /** 显示顺序 */
  // @IsOptional()
  // @IsInt()
  roleSort: number;

  /** 角色状态（0正常 1停用） */
  // @IsOptional()
  // @MaxLength(1)
  status: string;

  /** 备注 */
  // @IsOptional()
  // @MaxLength(500)
  remark: string;

  /** 菜单权限 */
  // @IsOptional()
  // @IsArray()
  menuIds: number[];

  /** 部门权限 */
  // @IsOptional()
  // @IsArray()
  deptIds: number[];
}

/**
 * 更新
 */
export interface UpdateRoleDto extends CreateRoleDto {
  /** 角色ID */
  // @IsNotEmpty()
  // @IsInt()
  roleId: number;
}
