import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 字典类型表
 */
@Entity({ name: 'sys_dict_type' })
export class SysDictType extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'dict_id',
    type: 'bigint',
    comment: '字典ID',
  })
  @IsInt()
  @IsNotEmpty()
  dictId: number

  @Column({
    name: 'dict_name',
    type: 'varchar',
    length: 100,
    comment: '字典名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictName: string

  @Column({
    name: 'dict_type',
    type: 'varchar',
    length: 100,
    comment: '字典类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  dictType: string

  @Column({
    name: 'dict_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  @IsInt()
  @IsOptional()
  dictSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '字典状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
