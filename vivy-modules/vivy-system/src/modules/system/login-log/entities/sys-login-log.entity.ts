import { BaseStatusEnums, BaseTimeEntity } from '@vivy-common/core'
import { LoginType } from '@vivy-common/logger'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 登录日志表
 */
@Entity({ name: 'sys_login_log' })
export class SysLoginLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'login_id',
    type: 'bigint',
    comment: '登录ID',
  })
  @IsInt()
  @IsNotEmpty()
  loginId: number

  @Column({
    name: 'login_name',
    type: 'varchar',
    length: 50,
    comment: '用户账号',
  })
  @MaxLength(50)
  @IsNotEmpty()
  loginName: string

  @Column({
    name: 'login_type',
    type: 'char',
    length: 1,
    comment: '登录类型',
  })
  @IsEnum(LoginType)
  @IsNotEmpty()
  loginType: string

  @Column({
    name: 'login_status',
    type: 'char',
    length: 1,
    comment: '登录状态',
  })
  @IsEnum(BaseStatusEnums)
  @IsNotEmpty()
  loginStatus: string

  @Column({
    name: 'login_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '主机地址',
  })
  @MaxLength(128)
  @IsOptional()
  loginIp?: string

  @Column({
    name: 'login_location',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '登录地点',
  })
  @MaxLength(255)
  @IsOptional()
  loginLocation?: string

  @Column({
    name: 'login_message',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '登录信息',
  })
  @MaxLength(255)
  @IsOptional()
  loginMessage?: string

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '用户代理',
  })
  @MaxLength(500)
  @IsOptional()
  userAgent?: string
}
