import { OmitType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginateDto } from '@vivy-common/core'
import { Allow, IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 列表
 */
export class ListUserDto extends PaginateDto {
  /** 部门ID */
  @Allow()
  @ApiPropertyOptional()
  deptId: number

  /** 用户账号 */
  @Allow()
  @ApiPropertyOptional()
  userName: string = ''

  /** 用户昵称 */
  @Allow()
  @ApiPropertyOptional()
  nickName: string = ''

  /** 用户性别（0男 1女 2未知） */
  @Allow()
  @ApiPropertyOptional()
  sex: string

  /** 用户状态（0正常 1停用） */
  @Allow()
  @ApiPropertyOptional()
  status: string
}

/**
 * 新增
 */
export class CreateUserDto {
  /** 部门ID */
  @IsOptional()
  @IsInt()
  deptId: number

  /** 用户账号 */
  @IsNotEmpty()
  @MaxLength(50)
  userName: string

  /** 用户昵称 */
  @IsNotEmpty()
  @MaxLength(50)
  nickName: string

  /** 用户邮箱 */
  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  email: string

  /** 手机号码 */
  @IsOptional()
  @MaxLength(11)
  phonenumber: string

  /** 用户性别（0男 1女 2未知） */
  @IsOptional()
  @MaxLength(1)
  sex: string

  /** 头像地址 */
  @IsOptional()
  @MaxLength(255)
  avatar: string

  /** 密码 */
  @IsNotEmpty()
  @MaxLength(255)
  password: string

  /** 用户状态（0正常 1停用） */
  @IsOptional()
  @MaxLength(1)
  status: string

  /** 备注 */
  @IsOptional()
  @MaxLength(500)
  remark: string

  /** 用户角色 */
  @IsOptional()
  @IsArray()
  roleIds: number[]

  /** 用户岗位 */
  @IsOptional()
  @IsArray()
  postIds: number[]
}

/**
 * 更新
 */
export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
  /** 用户ID */
  @IsNotEmpty()
  @IsInt()
  userId: number
}
