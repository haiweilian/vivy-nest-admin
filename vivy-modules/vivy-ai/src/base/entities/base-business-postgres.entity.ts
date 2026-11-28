import { DateTimeTransformer } from '@vivy-common/core'
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * PostgreSQL 基础业务实体
 *
 * 公共 BaseBusinessEntity 的时间列固定为 MySQL 的 datetime，PostgreSQL 驱动不支持该类型；
 * 子类重复声明同名列不会替换父类元数据，因此单独声明一份，字段名与响应格式保持一致。
 */
export abstract class BaseBusinessPostgresEntity {
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
    type: 'timestamp',
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
    type: 'timestamp',
    comment: '更新时间',
    transformer: DateTimeTransformer,
  })
  updateTime: string
}
