import { BaseBusinessEntity } from '@vivy-common/core'
import { IsBooleanString, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 部门表
 */
@Entity({ name: 'sys_dept' })
export class SysDept extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dept_id',
    type: 'int',
    comment: '部门ID',
  })
  @IsInt()
  @IsNotEmpty()
  deptId: number

  @Column({
    name: 'parent_id',
    type: 'int',
    nullable: true,
    comment: '父部门ID',
  })
  @IsInt()
  @IsOptional()
  parentId?: number

  @Column({
    name: 'dept_name',
    type: 'varchar',
    length: 50,
    comment: '部门名称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  deptName: string

  @Column({
    name: 'dept_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  @IsInt()
  @IsOptional()
  deptSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '部门状态（0正常 1停用）',
  })
  @IsBooleanString()
  @IsOptional()
  status: string
}
