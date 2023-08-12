/**
 * 添加部门
 */
export interface CreateDeptParams {
  /** 父部门ID */
  parentId?: number

  /** 部门名称 */
  deptName: string

  /** 显示顺序 */
  deptSort?: number

  /** 部门状态（0正常 1停用） */
  status?: string
}

/**
 * 更新部门
 */
export interface UpdateDeptParams extends CreateDeptParams {
  /** 部门ID */
  deptId: number
}
