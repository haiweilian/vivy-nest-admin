// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
// import { BaseBusinessEntity } from '@vivy-cloud/common-core'
import { BaseBusinessEntity } from '@/apis/types/entities'

/**
 * 角色信息表
 */
// @Entity({ name: 'sys_role' })
export interface SysRole extends BaseBusinessEntity {
  // @PrimaryGeneratedColumn({
  //   name: 'role_id',
  //   type: 'int',
  //   comment: '角色ID',
  // })
  roleId: number

  // @Column({
  //   name: 'role_name',
  //   type: 'varchar',
  //   length: 50,
  //   comment: '角色名称',
  // })
  roleName: string

  // @Column({
  //   name: 'role_code',
  //   type: 'varchar',
  //   length: 50,
  //   comment: '角色编码',
  // })
  roleCode: string

  // @Column({
  //   name: 'role_sort',
  //   type: 'int',
  //   default: 0,
  //   comment: '显示顺序',
  // })
  roleSort: number

  // @Column({
  //   name: 'status',
  //   type: 'char',
  //   length: 1,
  //   default: '0',
  //   comment: '角色状态（0正常 1停用）',
  // })
  status: string
}
