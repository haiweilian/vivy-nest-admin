import { BaseBusinessEntity, BaseIsEnums, BaseStatusEnums } from '@vivy-common/core'
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 菜单权限表
 */
@Entity({ name: 'sys_menu' })
export class SysMenu extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'menu_id',
    type: 'bigint',
    comment: '菜单ID',
  })
  @IsInt()
  @IsNotEmpty()
  menuId: number

  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: '父菜单ID',
  })
  @IsInt()
  @IsOptional()
  parentId: number

  @Column({
    name: 'menu_name',
    type: 'varchar',
    length: 50,
    comment: '菜单名称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  menuName: string

  @Column({
    name: 'menu_type',
    type: 'char',
    length: 1,
    comment: '菜单类型（M目录 C菜单 F按钮）',
  })
  @IsIn(['M', 'C', 'F'])
  @IsNotEmpty()
  menuType: string

  @Column({
    name: 'menu_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  @IsInt()
  @IsOptional()
  menuSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '菜单状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnums)
  @IsOptional()
  status: string

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '路由地址',
  })
  @MaxLength(255)
  @IsOptional()
  path?: string

  @Column({
    name: 'component',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '组件路径',
  })
  @MaxLength(255)
  @IsOptional()
  component?: string

  @Column({
    name: 'query',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '路由参数',
  })
  @MaxLength(255)
  @IsOptional()
  query?: string

  @Column({
    name: 'permission',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '权限标识',
  })
  @MaxLength(100)
  @IsOptional()
  permission?: string

  @Column({
    name: 'icon',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '菜单图标',
  })
  @MaxLength(100)
  @IsOptional()
  icon?: string

  @Column({
    name: 'is_visible',
    type: 'char',
    length: 1,
    default: '1',
    comment: '是否显示（0否 1是）',
  })
  @IsEnum(BaseIsEnums)
  @IsOptional()
  isVisible: string

  @Column({
    name: 'is_link',
    type: 'char',
    length: 1,
    default: '0',
    comment: '是否为外链（0否 1是）',
  })
  @IsEnum(BaseIsEnums)
  @IsOptional()
  isLink: string

  @Column({
    name: 'is_frame',
    type: 'char',
    length: 1,
    default: '0',
    comment: '是否为内嵌（0否 1是）',
  })
  @IsEnum(BaseIsEnums)
  @IsOptional()
  isFrame: string

  @Column({
    name: 'is_cache',
    type: 'char',
    length: 1,
    default: '0',
    comment: '是否缓存（0否 1是）',
  })
  @IsEnum(BaseIsEnums)
  @IsOptional()
  isCache: string
}
