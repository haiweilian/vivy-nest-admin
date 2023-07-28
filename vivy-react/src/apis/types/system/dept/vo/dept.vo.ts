import { SysDept } from '../sys-dept.entity'

/**
 * 部门树
 */
export interface DeptTreeVo extends SysDept {
  /** 子节点 */
  children?: DeptTreeVo[]
}
