import { BaseBusinessEntity } from '@vivy-common/core'
import { IsBooleanString, IsEmail, IsInt, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 用户信息表
 */
@Entity({ name: 'sys_user' })
export class SysUser extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'int',
    comment: '用户ID',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number

  @Column({
    name: 'dept_id',
    type: 'int',
    nullable: true,
    comment: '部门ID',
  })
  @IsInt()
  @IsOptional()
  deptId?: number

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户账号',
  })
  @MaxLength(50)
  @IsNotEmpty()
  userName: string

  @Column({
    name: 'nick_name',
    type: 'varchar',
    length: 50,
    comment: '用户昵称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  nickName: string

  @Column({
    name: 'user_type',
    type: 'char',
    length: 2,
    default: '00',
    comment: '用户类型（00系统用户）',
  })
  @MaxLength(2)
  @IsOptional()
  userType: string

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '用户邮箱',
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @Column({
    name: 'phonenumber',
    type: 'varchar',
    length: 11,
    nullable: true,
    comment: '手机号码',
  })
  @IsMobilePhone('zh-CN')
  @IsOptional()
  phonenumber?: string

  @Column({
    name: 'sex',
    type: 'char',
    length: 1,
    default: '2',
    comment: '用户性别（0男 1女 2未知）',
  })
  @MaxLength(1)
  @IsOptional()
  sex: string

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '头像地址',
  })
  @MaxLength(255)
  @IsOptional()
  avatar?: string

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
    comment: '密码',
  })
  @MaxLength(255)
  @IsNotEmpty()
  password: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '用户状态（0正常 1停用）',
  })
  @IsBooleanString()
  @IsOptional()
  status: string

  @Column({
    name: 'del_flag',
    type: 'char',
    length: 1,
    default: '0',
    select: false,
    comment: '删除标志（0存在 1删除）',
  })
  delFlag: string
}
