import { BaseBusinessEntity } from '@vivy-common/core'
import { IsBooleanString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { GenTable } from './gen-table.entity'

/**
 * 代码生成业务表字段
 */
@Entity({ name: 'gen_table_column' })
export class GenTableColumn extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'column_id',
    type: 'int',
    comment: '编号',
  })
  @IsInt()
  @IsNotEmpty()
  columnId: number

  @Column({
    name: 'table_id',
    type: 'int',
    comment: '归属表编号',
  })
  @IsInt()
  @IsNotEmpty()
  tableId: number

  @Column({
    name: 'column_name',
    type: 'varchar',
    length: 100,
    comment: '列名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  columnName: string

  @Column({
    name: 'column_type',
    type: 'varchar',
    length: 100,
    comment: '列类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  columnType: string

  @Column({
    name: 'column_sort',
    type: 'int',
    default: 0,
    comment: '列顺序',
  })
  @IsInt()
  @IsOptional()
  columnSort: number

  @Column({
    name: 'column_comment',
    type: 'varchar',
    length: 500,
    comment: '列描述',
  })
  @MaxLength(500)
  @IsString()
  columnComment: string

  @Column({
    name: 'is_pk',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否主键（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isPk?: string

  @Column({
    name: 'is_increment',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否自增（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isIncrement?: string

  @Column({
    name: 'is_required',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否必填（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isRequired?: string

  @Column({
    name: 'is_insert',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否为插入字段（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isInsert?: string

  @Column({
    name: 'is_edit',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否编辑字段（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isEdit?: string

  @Column({
    name: 'is_list',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否列表字段（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isList?: string

  @Column({
    name: 'is_query',
    type: 'char',
    length: 1,
    nullable: true,
    comment: '是否查询字段（0是 1否）',
  })
  @IsBooleanString()
  @IsOptional()
  isQuery?: string

  @Column({
    name: 'field_name',
    type: 'varchar',
    length: 100,
    comment: '属性名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fieldName: string

  @Column({
    name: 'tslang_type',
    type: 'varchar',
    length: 100,
    comment: 'TS类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  tslangType: string

  @Column({
    name: 'javalang_type',
    type: 'varchar',
    length: 100,
    comment: 'JAVA类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  javalangType: string

  @Column({
    name: 'query_type',
    type: 'varchar',
    length: 100,
    comment: '查询方式',
  })
  @MaxLength(100)
  @IsNotEmpty()
  queryType: string

  @Column({
    name: 'html_type',
    type: 'varchar',
    length: 100,
    comment: '显示类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  htmlType: string

  @Column({
    name: 'dict_type',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '字典类型',
  })
  @MaxLength(100)
  @IsOptional()
  dictType?: string

  @JoinColumn({
    name: 'table_id',
    foreignKeyConstraintName: 'table_fk',
  })
  @ManyToOne(() => GenTable, (table) => table.columns, {
    onDelete: 'CASCADE',
  })
  table: GenTable
}
