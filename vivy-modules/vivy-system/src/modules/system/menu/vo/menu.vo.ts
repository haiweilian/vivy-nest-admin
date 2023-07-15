import { SysMenu } from '@/entities/sys-menu.entity'

/**
 * 菜单树
 */
export class MenuTreeVo extends SysMenu {
  /** 子节点 */
  children: MenuTreeVo[]
}
