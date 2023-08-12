import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { DateTimeTransformer } from './transformer/datetime.transformer'

/**
 * 基础业务实体
 */
export abstract class BaseBusinessEntity {
  @Column({
    name: 'create_by',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '创建者',
  })
  createBy?: string

  @CreateDateColumn({
    name: 'create_time',
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
  updateBy?: string

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    comment: '更新时间',
    transformer: DateTimeTransformer,
  })
  updateTime: string
}
