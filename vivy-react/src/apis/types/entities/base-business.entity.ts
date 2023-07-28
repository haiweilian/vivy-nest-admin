// import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * 基础业务实体
 */
export interface BaseBusinessEntity {
  // @Column({
  //   name: 'del_flag',
  //   type: 'char',
  //   length: 1,
  //   default: '0',
  //   comment: '删除标志（0存在 1删除）',
  // })
  delFlag: string

  // @Column({
  //   name: 'create_by',
  //   type: 'varchar',
  //   length: 50,
  //   nullable: true,
  //   comment: '创建者',
  // })
  createBy: string

  // @CreateDateColumn({
  //   name: 'create_time',
  //   type: 'datetime',
  //   comment: '创建时间',
  // })
  createTime: string

  // @Column({
  //   name: 'update_by',
  //   type: 'varchar',
  //   length: 50,
  //   nullable: true,
  //   comment: '更新者',
  // })
  updateBy: string

  // @UpdateDateColumn({
  //   name: 'update_time',
  //   type: 'datetime',
  //   comment: '更新时间',
  // })
  updateTime: string

  // @Column({
  //   name: 'remark',
  //   type: 'varchar',
  //   length: 500,
  //   nullable: true,
  //   comment: '备注',
  // })
  remark: string
}
