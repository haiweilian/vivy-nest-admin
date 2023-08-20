/**
 * 角色信息
 */
export interface RoleModel {
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
export interface RoleInfoResult extends RoleModel {
  /** 菜单权限 */
  menuIds: number[]

  /** 部门权限 */
  deptIds: number[]
}

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
export type CreateRoleParams = Omit<RoleModel, 'roleId'>

/**
 * 更新角色
 */
export type UpdateRoleParams = RoleModel
