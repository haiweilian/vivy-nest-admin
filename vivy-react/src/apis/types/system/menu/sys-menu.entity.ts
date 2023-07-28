// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
// import { BaseBusinessEntity } from '@vivy-cloud/common-core'
import { BaseBusinessEntity } from '@/apis/types/entities'

/**
 * 菜单权限表
 */
// @Entity({ name: 'sys_menu' })
export interface SysMenu extends BaseBusinessEntity {
  // @PrimaryGeneratedColumn({
  //   name: 'menu_id',
  //   type: 'int',
  //   comment: '菜单ID',
  // })
  menuId: number

  // @Column({
  //   name: 'parent_id',
  //   type: 'int',
  //   comment: '父菜单ID',
  // })
  parentId: number

  // @Column({
  //   name: 'menu_name',
  //   type: 'varchar',
  //   length: 50,
  //   comment: '菜单名称',
  // })
  menuName: string

  // @Column({
  //   name: 'menu_type',
  //   type: 'char',
  //   length: 1,
  //   comment: '菜单类型（M目录 C菜单 F按钮）',
  // })
  menuType: number

  // @Column({
  //   name: 'menu_sort',
  //   type: 'int',
  //   default: 0,
  //   comment: '显示顺序',
  // })
  menuSort: number

  // @Column({
  //   name: 'status',
  //   type: 'char',
  //   length: 1,
  //   default: '0',
  //   comment: '菜单状态（0正常 1停用）',
  // })
  status: string

  // @Column({
  //   name: 'path',
  //   type: 'varchar',
  //   length: 255,
  //   nullable: true,
  //   comment: '路由地址',
  // })
  path: string

  // @Column({
  //   name: 'component',
  //   type: 'varchar',
  //   length: 255,
  //   nullable: true,
  //   comment: '组件路径',
  // })
  component: string

  // @Column({
  //   name: 'query',
  //   type: 'varchar',
  //   length: 255,
  //   nullable: true,
  //   comment: '路由参数',
  // })
  query: string

  // @Column({
  //   name: 'perms',
  //   type: 'varchar',
  //   length: 100,
  //   nullable: true,
  //   comment: '权限标识',
  // })
  permission: string

  // @Column({
  //   name: 'icon',
  //   type: 'varchar',
  //   length: 100,
  //   default: '#',
  //   comment: '菜单图标',
  // })
  icon: string

  // @Column({
  //   name: 'is_visible',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '菜单状态（0显示 1隐藏）',
  // })
  isVisible: number

  // @Column({
  //   name: 'is_link',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '是否为外链（0否 1是）',
  // })
  isLink: number

  // @Column({
  //   name: 'is_frame',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '是否为内嵌（0否 1是）',
  // })
  isFrame: number

  // @Column({
  //   name: 'is_cache',
  //   type: 'tinyint',
  //   unsigned: true,
  //   default: 0,
  //   comment: '是否缓存（0否 1是）',
  // })
  isCache: number
}
