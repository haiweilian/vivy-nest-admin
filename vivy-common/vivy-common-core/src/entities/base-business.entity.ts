import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { DateTimeTransformer } from './transformer/datetime.transformer'

/**
 * 基础业务实体
 */
export abstract class BaseBusinessEntity {
  @Column({
    name: 'del_flag',
    type: 'char',
    length: 1,
    default: '0',
    select: false,
    comment: '删除标志（0存在 1删除）',
  })
  delFlag: string

  @Column({
    name: 'create_by',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '创建者',
  })
  createBy: string

  @CreateDateColumn({
    name: 'created_time',
    type: 'datetime',
    comment: '创建时间',
    transformer: DateTimeTransformer,
  })
  createTime: string

  @Column({
    name: 'update_by',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '更新者',
  })
  updateBy: string

  @UpdateDateColumn({
    name: 'updated_time',
    type: 'datetime',
    comment: '更新时间',
    transformer: DateTimeTransformer,
  })
  updateTime: string

  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '备注',
  })
  remark: string
}
