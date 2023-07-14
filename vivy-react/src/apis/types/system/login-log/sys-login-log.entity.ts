// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
// import { BaseTimeEntity } from '@vivy-cloud/common-core'
import { BaseTimeEntity } from '@/apis/types/entities';

/**
 * 登录日志表
 */
// @Entity({ name: 'sys_login_log' })
export interface SysLoginLog extends BaseTimeEntity {
  // @PrimaryGeneratedColumn({
  //   name: 'login_id',
  //   type: 'int',
  //   comment: '登录ID',
  // })
  loginId: number;

  // @Column({
  //   name: 'login_name',
  //   type: 'varchar',
  //   length: 50,
  //   default: '',
  //   comment: '用户账号',
  // })
  loginName: string;

  // @Column({
  //   name: 'login_type',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '登录类型(enum LoginType)',
  // })
  loginType: number;

  // @Column({
  //   name: 'login_status',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '登录状态(enum OperStatus)',
  // })
  loginStatus: number;

  // @Column({
  //   name: 'login_ip',
  //   type: 'varchar',
  //   length: 128,
  //   default: '',
  //   comment: '主机地址',
  // })
  loginIp: string;

  // @Column({
  //   name: 'login_location',
  //   type: 'varchar',
  //   length: 255,
  //   default: '',
  //   comment: '登录地点',
  // })
  loginLocation: string;

  // @Column({
  //   name: 'login_message',
  //   type: 'varchar',
  //   length: 255,
  //   default: '',
  //   comment: '登录信息',
  // })
  loginMessage: string;

  // @Column({
  //   name: 'user_agent',
  //   type: 'varchar',
  //   length: 500,
  //   default: '',
  //   comment: '用户代理',
  // })
  userAgent: string;
}
