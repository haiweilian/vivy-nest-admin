import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { DataScopeType } from '@vivy-common/datascope'
import { Allow, IsArray, IsEnum, IsOptional } from 'class-validator'
import { SysRole } from '../entities/sys-role.entity'

/**
 * 查询角色
 */
export class ListRoleDto extends PaginateDto {
  /** 角色名称 */
  @Allow()
  roleName?: string

  /** 角色编码 */
  @Allow()
  roleCode?: string

  /** 角色状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加角色
 */
export class CreateRoleDto extends OmitType(SysRole, ['roleId'] as const) {
  /** 菜单权限 */
  @IsArray()
  @IsOptional()
  menuIds?: number[]

  /** 部门权限 */
  // @IsArray()
  // @IsOptional()
  // deptIds?: number[]
}

/**
 * 更新角色
 */
export class UpdateRoleDto extends OmitType(SysRole, ['roleId'] as const) {
  /** 菜单权限 */
  @IsArray()
  @IsOptional()
  menuIds?: number[]

  /** 部门权限 */
  // @IsArray()
  // @IsOptional()
  // deptIds?: number[]
}

/**
 * 更新数据权限
 */
export class UpdateDataScopeDto {
  /** 数据范围 */
  @IsEnum(DataScopeType)
  dataScope: string

  /** 部门权限 */
  @IsArray()
  @IsOptional()
  deptIds?: number[]
}
