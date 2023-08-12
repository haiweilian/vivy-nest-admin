/**
 * 角色信息
 */
export interface RoleResult {
  /** 角色ID */
  roleId: number

  /** 角色名称 */
  roleName: string

  /** 角色编码 */
  roleCode: string

  /** 显示顺序 */
  roleSort: number

  /** 角色状态（0正常 1停用） */
  status: string
}

/**
 * 角色详情
 */
export interface RoleInfoResult extends RoleResult {
  /** 菜单权限 */
  menuIds: number[]

  /** 部门权限 */
  deptIds: number[]
}
