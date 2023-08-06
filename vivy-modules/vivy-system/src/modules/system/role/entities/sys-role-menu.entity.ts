import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * 角色和菜单关联表 角色1-N菜单
 */
@Entity({ name: 'sys_role_menu' })
export class SysRoleMenu extends BaseTimeEntity {
  @Column({
    name: 'role_id',
    type: 'int',
    primary: true,
    comment: '角色ID',
  })
  roleId: number

  @Column({
    name: 'menu_id',
    type: 'int',
    primary: true,
    comment: '菜单ID',
  })
  menuId: number
}
