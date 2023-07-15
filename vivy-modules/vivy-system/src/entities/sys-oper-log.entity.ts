import { BaseTimeEntity } from '@vivy-common/core'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 操作日志表
 */
@Entity({ name: 'sys_oper_log' })
export class SysOperLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'oper_id',
    type: 'int',
    comment: '操作ID',
  })
  operId: number

  @Column({
    name: 'title',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '模块标题',
  })
  title: string

  @Column({
    name: 'oper_type',
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '操作类型(enum OperType)',
  })
  operType: number

  @Column({
    name: 'oper_name',
    type: 'varchar',
    length: 50,
    default: '',
    comment: '操作人员',
  })
  operName: string

  @Column({
    name: 'oper_method',
    type: 'varchar',
    length: 100,
    default: '',
    comment: '方法名称',
  })
  operMethod: string

  @Column({
    name: 'oper_ip',
    type: 'varchar',
    length: 128,
    default: '',
    comment: '主机地址',
  })
  operIp: string

  @Column({
    name: 'oper_location',
    type: 'varchar',
    length: 255,
    default: '',
    comment: '操作地点',
  })
  operLocation: string

  @Column({
    name: 'oper_status',
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '操作状态(enum OperStatus)',
  })
  operStatus: number

  @Column({
    name: 'request_url',
    type: 'varchar',
    length: 1000,
    default: '',
    comment: '请求URL',
  })
  requestUrl: string

  @Column({
    name: 'request_method',
    type: 'varchar',
    length: 10,
    default: '',
    comment: '请求方式',
  })
  requestMethod: string

  @Column({
    name: 'request_param',
    type: 'varchar',
    length: 2000,
    default: '',
    comment: '请求参数',
  })
  requestParam: string

  @Column({
    name: 'request_result',
    type: 'varchar',
    length: 2000,
    default: '',
    comment: '请求返回结果',
  })
  requestResult: string

  @Column({
    name: 'request_errmsg',
    type: 'varchar',
    length: 2000,
    default: '',
    comment: '请求错误消息',
  })
  requestErrmsg: string
}
