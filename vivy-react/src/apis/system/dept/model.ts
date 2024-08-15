/**
 * 部门
 */
export interface DeptModel {
  /** 部门ID */
  deptId: number

  /** 父部门ID */
  parentId?: number

  /** 部门名称 */
  deptName: string

  /** 显示顺序 */
  deptSort: number

  /** 部门状态（0正常 1停用） */
  status: string
}

/**
 * 部门树
 */
export interface DeptTreeResult extends DeptModel {
  /** 子节点 */
  children?: DeptTreeResult[]
}

/**
 * 添加部门
 */
export type CreateDeptParams = Omit<DeptModel, 'deptId'>

/**
 * 更新部门
 */
export type UpdateDeptParams = Omit<DeptModel, 'deptId'>
