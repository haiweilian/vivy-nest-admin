import { BaseBusinessEntity } from '@vivy-common/core'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 菜单权限表
 */
@Entity({ name: 'sys_menu' })
export class SysMenu extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'menu_id',
    type: 'int',
    comment: '菜单ID',
  })
  menuId: number

  @Column({
    name: 'parent_id',
    type: 'int',
    comment: '父菜单ID',
  })
  parentId: number

  @Column({
    name: 'menu_name',
    type: 'varchar',
    length: 50,
    comment: '菜单名称',
  })
  menuName: string

  @Column({
    name: 'menu_type',
    type: 'char',
    length: 1,
    comment: '菜单类型（M目录 C菜单 F按钮）',
  })
  menuType: string

  @Column({
    name: 'menu_sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  menuSort: number

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '菜单状态（0正常 1停用）',
  })
  status: string

  @Column({
    name: 'path',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '路由地址',
  })
  path: string

  @Column({
    name: 'component',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '组件路径',
  })
  component: string

  @Column({
    name: 'query',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '路由参数',
  })
  query: string

  @Column({
    name: 'permission',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '权限标识',
  })
  permission: string

  @Column({
    name: 'icon',
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '菜单图标',
  })
  icon: string

  @Column({
    name: 'is_visible',
    type: 'char',
    length: 1,
    default: '0',
    comment: '是否显示（0是 1否）',
  })
  isVisible: string

  @Column({
    name: 'is_link',
    type: 'char',
    length: 1,
    default: '1',
    comment: '是否为外链（0是 1否）',
  })
  isLink: string

  @Column({
    name: 'is_frame',
    type: 'char',
    length: 1,
    default: '1',
    comment: '是否为内嵌（0是 1否）',
  })
  isFrame: string

  @Column({
    name: 'is_cache',
    type: 'char',
    length: 1,
    default: '1',
    comment: '是否缓存（0是 1否）',
  })
  isCache: string
}
