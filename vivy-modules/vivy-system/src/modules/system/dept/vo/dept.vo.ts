import { SysDept } from '../entities/sys-dept.entity.js'

/**
 * 部门树
 */
export class DeptTreeVo extends SysDept {
  /** 子节点 */
  children: DeptTreeVo[]
}
