// import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 基础时间实体
 */
export interface BaseTimeEntity {
  // @CreateDateColumn({
  //   name: 'create_time',
  //   type: 'datetime',
  //   comment: '创建时间',
  // })
  createTime: string

  // @UpdateDateColumn({
  //   name: 'update_time',
  //   type: 'datetime',
  //   comment: '更新时间',
  // })
  updateTime: string
}
