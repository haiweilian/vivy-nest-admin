import { BaseBusinessEntity } from '@vivy-common/core'
import { IsBooleanString, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 岗位信息表
 */
@Entity({ name: 'sys_post' })
export class SysPost extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'post_id',
    type: 'int',
    comment: '岗位ID',
  })
  @IsInt()
  @IsNotEmpty()
  postId: number

  @Column({
    name: 'post_name',
    type: 'varchar',
    length: 50,
    comment: '岗位名称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  postName: string

  @Column({
    name: 'post_code',
    type: 'varchar',
    length: 50,
    comment: '岗位编码',
  })
  @MaxLength(50)
  @IsNotEmpty()
  postCode: string

  @Column({
    name: 'post_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  @IsInt()
  @IsOptional()
  postSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '岗位状态（0正常 1停用）',
  })
  @IsBooleanString()
  @IsOptional()
  status: string
}
