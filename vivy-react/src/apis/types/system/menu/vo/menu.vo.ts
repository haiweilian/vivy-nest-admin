import { SysMenu } from '../sys-menu.entity'

/**
 * 菜单树
 */
export interface MenuTreeVo extends SysMenu {
  /** 子节点 */
  children?: MenuTreeVo[]
}
