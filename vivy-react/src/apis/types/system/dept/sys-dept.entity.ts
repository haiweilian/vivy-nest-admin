// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
// import { BaseBusinessEntity } from '@vivy-cloud/common-core';
import { BaseBusinessEntity } from '@/apis/types/entities'

/**
 * 部门表
 */
// @Entity({ name: 'sys_dept' })
export interface SysDept extends BaseBusinessEntity {
  // @PrimaryGeneratedColumn({
  //   name: 'dept_id',
  //   type: 'int',
  //   comment: '部门ID',
  // })
  deptId: number

  // @Column({
  //   name: 'parent_id',
  //   type: 'int',
  //   comment: '父部门ID',
  // })
  parentId: number

  // @Column({
  //   name: 'dept_name',
  //   type: 'varchar',
  //   length: 50,
  //   comment: '部门名称',
  // })
  deptName: string

  // @Column({
  //   name: 'dept_sort',
  //   type: 'int',
  //   default: 0,
  //   comment: '显示顺序',
  // })
  deptSort: number

  // @Column({
  //   name: 'status',
  //   type: 'char',
  //   length: 1,
  //   default: '0',
  //   comment: '部门状态（0正常 1停用）',
  // })
  status: string
}
