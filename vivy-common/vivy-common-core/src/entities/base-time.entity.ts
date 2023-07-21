import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { DateTimeTransformer } from './transformer/datetime.transformer'

/**
 * 基础时间实体
 */
export abstract class BaseTimeEntity {
  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    comment: '创建时间',
    transformer: DateTimeTransformer,
  })
  createTime: string

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    comment: '更新时间',
    transformer: DateTimeTransformer,
  })
  updateTime: string
}
