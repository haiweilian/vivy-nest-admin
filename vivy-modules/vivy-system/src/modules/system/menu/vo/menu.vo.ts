import { SysMenu } from '../entities/sys-menu.entity'

/**
 * 菜单树
 */
export class MenuTreeVo extends SysMenu {
  /** 子节点 */
  children: MenuTreeVo[]
}

/**
 * 路由树
 */
export class RouterTreeVo {
  /** 菜单的名字 */
  name: string

  /** 路径,可以设定为网页链接 */
  path: string

  /** 菜单的 icon */
  icon: string

  /** 自定义菜单的国际化 key */
  locale: string | false

  /** 组件路径，通过路径找到组件元素 */
  component: string

  /** 子菜单 */
  children: RouterTreeVo[]

  /** 在菜单中隐藏自己和子节点 */
  hideInMenu: boolean

  /** 在菜单中隐藏子节点 */
  hideChildrenInMenu: boolean

  /** 当此节点被选中的时候也会选中 parentKeys 的节点 */
  parentKeys: string[]
}
