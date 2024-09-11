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

  /** 数据范围（1全部数据权限 2自定数据权限 3本部门数据权限 4本部门及以下数据权限 5仅本人数据权限） */
  dataScope: string

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
export interface CreateRoleParams extends Omit<RoleModel, 'roleId'> {
  /** 菜单权限 */
  menuIds: number[]

  // /** 部门权限 */
  // deptIds: number[]
}

/**
 * 更新角色
 */
export interface UpdateRoleParams extends Omit<RoleModel, 'roleId'> {
  /** 菜单权限 */
  menuIds: number[]

  // /** 部门权限 */
  // deptIds: number[]
}

/**
 * 更新数据权限
 */
export interface UpdateDataScopeParams {
  /** 数据范围 */
  dataScope: string

  /** 部门权限 */
  deptIds?: number[]
}
