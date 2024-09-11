import { BaseBusinessEntity, BaseStatusEnum } from '@vivy-common/core'
import { DataScopeType } from '@vivy-common/datascope'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 角色信息表
 */
@Entity({ name: 'sys_role' })
export class SysRole extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'role_id',
    type: 'bigint',
    comment: '角色ID',
  })
  @IsInt()
  @IsNotEmpty()
  roleId: number

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 50,
    comment: '角色名称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  roleName: string

  @Column({
    name: 'role_code',
    type: 'varchar',
    length: 50,
    comment: '角色编码',
  })
  @MaxLength(50)
  @IsNotEmpty()
  roleCode: string

  @Column({
    name: 'role_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  @IsInt()
  @IsOptional()
  roleSort: number

  @Column({
    name: 'data_scope',
    type: 'char',
    length: 1,
    default: '1',
    comment: '数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5仅本人数据权限）',
  })
  @IsEnum(DataScopeType)
  @IsOptional()
  dataScope: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '角色状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnum)
  @IsOptional()
  status: string
}
