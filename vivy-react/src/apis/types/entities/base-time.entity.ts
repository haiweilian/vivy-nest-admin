// import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 基础时间实体
 */
export interface BaseTimeEntity {
  // @CreateDateColumn({
  //   name: 'created_time',
  //   type: 'datetime',
  //   comment: '创建时间',
  // })
  createdTime: string;

  // @UpdateDateColumn({
  //   name: 'updated_time',
  //   type: 'datetime',
  //   comment: '更新时间',
  // })
  updatedTime: string;
}
