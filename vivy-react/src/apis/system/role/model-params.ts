/**
 * 查询角色
 */
export interface ListRoleParams extends PaginateParams {
  /** 角色名称 */
  roleName?: string

  /** 角色编码 */
  roleCode?: string

  /** 角色状态（0正常 1停用） */
  status?: string
}

/**
 * 添加角色
 */
export interface CreateRoleParams {
  /** 角色名称 */
  roleName: string

  /** 角色编码 */
  roleCode: string

  /** 显示顺序 */
  roleSort?: number

  /** 角色状态（0正常 1停用） */
  status?: string

  /** 菜单权限 */
  menuIds?: number[]

  /** 部门权限 */
  deptIds?: number[]
}

/**
 * 更新角色
 */
export interface UpdateRoleParams extends CreateRoleParams {
  /** 角色ID */
  roleId: number
}
