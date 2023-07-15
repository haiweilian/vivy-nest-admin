import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { DateTimeTransformer } from './transformer/datetime.transformer'

/**
 * 基础时间实体
 */
export abstract class BaseTimeEntity {
  @CreateDateColumn({
    name: 'created_time',
    type: 'datetime',
    comment: '创建时间',
    transformer: DateTimeTransformer,
  })
  createdTime: string

  @UpdateDateColumn({
    name: 'updated_time',
    type: 'datetime',
    comment: '更新时间',
    transformer: DateTimeTransformer,
  })
  updatedTime: string
}
