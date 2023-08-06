import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow, IsArray, IsOptional } from 'class-validator'
import { SysUser } from '../entities/sys-user.entity'

/**
 * 列表
 */
export class ListUserDto extends PaginateDto {
  /** 部门ID */
  @Allow()
  deptId?: number

  /** 用户账号 */
  @Allow()
  userName?: string = ''

  /** 用户昵称 */
  @Allow()
  nickName?: string = ''

  /** 用户性别（0男 1女 2未知） */
  @Allow()
  sex?: string

  /** 用户状态（0正常 1停用） */
  @Allow()
  status?: string
}

/**
 * 新增
 */
export class CreateUserDto extends OmitType(SysUser, ['userId'] as const) {
  /** 用户角色 */
  @IsArray()
  @IsOptional()
  roleIds: number[]

  /** 用户岗位 */
  @IsArray()
  @IsOptional()
  postIds: number[]
}

/**
 * 更新
 */
export class UpdateUserDto extends OmitType(SysUser, ['password']) {
  /** 用户角色 */
  @IsArray()
  @IsOptional()
  roleIds: number[]

  /** 用户岗位 */
  @IsArray()
  @IsOptional()
  postIds: number[]
}
