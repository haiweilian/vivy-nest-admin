import { BaseBusinessEntity } from '@vivy-common/core'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { GenTableColumn } from './gen-table-column.entity'

/**
 * 代码生成业务表
 */
@Entity({ name: 'gen_table' })
export class GenTable extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'table_id',
    type: 'int',
    comment: '编号',
  })
  tableId: number

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 100,
    comment: '表名称',
  })
  tableName: string

  @Column({
    name: 'table_comment',
    type: 'varchar',
    length: 500,
    default: '',
    comment: '表描述',
  })
  tableComment: string

  @Column({
    name: 'sub_table_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '关联子表的表名',
  })
  subTableName: string

  @Column({
    name: 'sub_table_fk_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '子表关联的外键名',
  })
  subTableFkName: string

  @Column({
    name: 'class_name',
    type: 'varchar',
    length: 100,
    comment: '实体类名称',
  })
  className: string

  @Column({
    name: 'template_category',
    type: 'varchar',
    length: 2,
    default: '1',
    comment: '生成模板分类',
  })
  templateCategory: string

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 100,
    comment: '生成业务名',
  })
  businessName: string

  @Column({
    name: 'function_name',
    type: 'varchar',
    length: 100,
    comment: '生成功能名',
  })
  functionName: string

  @Column({
    name: 'function_author',
    type: 'varchar',
    length: 100,
    comment: '生成功能作者',
  })
  functionAuthor: string

  @OneToMany(() => GenTableColumn, (column) => column.table, {
    cascade: true,
  })
  columns: GenTableColumn[]
}
