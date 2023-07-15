import { SysRole } from '@/entities/sys-role.entity'

/**
 * 角色详情
 */
export class RoleInfoVo extends SysRole {
  /**
   * 菜单权限
   */
  menuIds: number[]

  /** 部门权限 */
  deptIds: number[]
}
