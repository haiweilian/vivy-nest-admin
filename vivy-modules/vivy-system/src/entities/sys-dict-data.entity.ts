import { BaseBusinessEntity } from '@vivy-common/core'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 字典数据表
 */
@Entity({ name: 'sys_dict_data' })
export class SysDictData extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    type: 'int',
    comment: '字典ID',
  })
  dictId: number

  @Column({
    name: 'dict_type',
    type: 'varchar',
    length: 100,
    comment: '字典类型',
  })
  dictType: string

  @Column({
    name: 'dict_label',
    type: 'varchar',
    length: 100,
    comment: '字典标签',
  })
  dictLabel: string

  @Column({
    name: 'dict_value',
    type: 'varchar',
    length: 100,
    comment: '字典键值',
  })
  dictValue: string

  @Column({
    name: 'dict_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  dictSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '字典状态（0正常 1停用）',
  })
  status: string

  @Column({
    name: 'css_class',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '样式属性（其他样式扩展）',
  })
  cssClass: string

  @Column({
    name: 'list_class',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '表格回显样式',
  })
  listClass: string
}
