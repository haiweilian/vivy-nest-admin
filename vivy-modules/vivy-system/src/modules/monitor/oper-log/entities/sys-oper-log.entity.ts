import { BaseStatusEnum, BaseTimeEntity } from '@vivy-common/core'
import { OperType } from '@vivy-common/logger'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 操作日志表
 */
@Entity({ name: 'sys_oper_log' })
export class SysOperLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'oper_id',
    type: 'bigint',
    comment: '操作ID',
  })
  @IsInt()
  @IsNotEmpty()
  operId: number

  @Column({
    name: 'title',
    type: 'varchar',
    length: 50,
    comment: '模块标题',
  })
  @MaxLength(50)
  @IsNotEmpty()
  title: string

  @Column({
    name: 'oper_type',
    type: 'char',
    length: 2,
    comment: '操作类型',
  })
  @IsEnum(OperType)
  @IsNotEmpty()
  operType: string

  @Column({
    name: 'oper_name',
    type: 'varchar',
    length: 50,
    comment: '操作人员',
  })
  @MaxLength(50)
  @IsNotEmpty()
  operName: string

  @Column({
    name: 'oper_method',
    type: 'varchar',
    length: 100,
    comment: '方法名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  operMethod: string

  @Column({
    name: 'oper_ip',
    type: 'varchar',
    length: 128,
    nullable: true,
    comment: '主机地址',
  })
  @MaxLength(128)
  @IsOptional()
  operIp?: string

  @Column({
    name: 'oper_location',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '操作地点',
  })
  @MaxLength(255)
  @IsOptional()
  operLocation?: string

  @Column({
    name: 'oper_status',
    type: 'char',
    length: 1,
    comment: '操作状态',
  })
  @IsEnum(BaseStatusEnum)
  @IsNotEmpty()
  operStatus: string

  @Column({
    name: 'request_url',
    type: 'varchar',
    length: 1000,
    comment: '请求URL',
  })
  @MaxLength(1000)
  @IsNotEmpty()
  requestUrl: string

  @Column({
    name: 'request_method',
    type: 'varchar',
    length: 10,
    comment: '请求方式',
  })
  @MaxLength(10)
  @IsNotEmpty()
  requestMethod: string

  @Column({
    name: 'request_param',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: '请求参数',
  })
  @MaxLength(2000)
  @IsOptional()
  requestParam?: string

  @Column({
    name: 'request_result',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: '请求返回结果',
  })
  @MaxLength(2000)
  @IsOptional()
  requestResult?: string

  @Column({
    name: 'request_errmsg',
    type: 'varchar',
    length: 2000,
    nullable: true,
    comment: '请求错误消息',
  })
  @MaxLength(2000)
  @IsOptional()
  requestErrmsg?: string
}
