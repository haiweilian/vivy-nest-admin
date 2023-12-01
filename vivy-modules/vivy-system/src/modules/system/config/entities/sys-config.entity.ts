import { BaseBusinessEntity, BaseStatusEnums } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 参数配置表
 */
@Entity({ name: 'sys_config' })
export class SysConfig extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'config_id',
    type: 'bigint',
    comment: '参数ID',
  })
  @IsInt()
  @IsNotEmpty()
  configId: number

  @Column({
    name: 'config_name',
    type: 'varchar',
    length: 100,
    comment: '参数名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  configName: string

  @Column({
    name: 'config_key',
    type: 'varchar',
    length: 100,
    comment: '参数键名',
  })
  @MaxLength(100)
  @IsNotEmpty()
  configKey: string

  @Column({
    name: 'config_value',
    type: 'varchar',
    length: 500,
    comment: '参数键值',
  })
  @MaxLength(500)
  @IsNotEmpty()
  configValue: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnums)
  @IsOptional()
  status: string

  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '备注',
  })
  @MaxLength(100)
  @IsOptional()
  remark?: string
}
