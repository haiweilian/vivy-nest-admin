import { SysRole } from '../sys-role.entity'

/**
 * 角色详情
 */
export interface RoleInfoVo extends SysRole {
  /**
   * 菜单权限
   */
  menuIds: number[]

  /** 部门权限 */
  deptIds: number[]
}
