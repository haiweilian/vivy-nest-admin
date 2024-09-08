import { BaseBusinessEntity } from '@vivy-common/core'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsInt, IsNotEmpty, IsOptional, MaxLength, ValidateNested } from 'class-validator'
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
  @IsInt()
  @IsNotEmpty()
  tableId: number

  @Column({
    name: 'table_name',
    type: 'varchar',
    length: 100,
    comment: '表名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tableName: string

  @Column({
    name: 'table_comment',
    type: 'varchar',
    length: 100,
    comment: '表描述',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tableComment: string

  @Column({
    name: 'sub_table_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '关联子表的表名',
  })
  @MaxLength(100)
  @IsOptional()
  subTableName?: string

  @Column({
    name: 'sub_table_fk_name',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '子表关联的外键名',
  })
  @MaxLength(100)
  @IsOptional()
  subTableFkName?: string

  @Column({
    name: 'class_name',
    type: 'varchar',
    length: 100,
    comment: '实体类名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  className: string

  @Column({
    name: 'template_category',
    type: 'varchar',
    length: 2,
    default: '1',
    comment: '生成模板分类',
  })
  @IsOptional()
  templateCategory: string

  @Column({
    name: 'module_name',
    type: 'varchar',
    length: 100,
    comment: '生成模块名',
  })
  @MaxLength(100)
  @IsNotEmpty()
  moduleName: string

  @Column({
    name: 'business_name',
    type: 'varchar',
    length: 100,
    comment: '生成业务名',
  })
  @MaxLength(100)
  @IsNotEmpty()
  businessName: string

  @Column({
    name: 'function_name',
    type: 'varchar',
    length: 100,
    comment: '生成功能名',
  })
  @MaxLength(100)
  @IsNotEmpty()
  functionName: string

  @Column({
    name: 'function_author',
    type: 'varchar',
    length: 100,
    comment: '生成功能作者',
  })
  @MaxLength(100)
  @IsNotEmpty()
  functionAuthor: string

  @OneToMany(() => GenTableColumn, (column) => column.table, {
    cascade: true,
  })
  @ValidateNested()
  @ArrayNotEmpty()
  @Type(() => GenTableColumn)
  columns: GenTableColumn[]
}
