/**
 * 菜单
 */
export interface MenuModel {
  /** 菜单ID */
  menuId: number

  /** 父菜单ID */
  parentId?: number

  /** 菜单名称 */
  menuName: string

  /** 菜单类型（M目录 C菜单 F按钮） */
  menuType: string

  /** 显示顺序 */
  menuSort: number

  /** 菜单状态（0正常 1停用） */
  status: string

  /** 路由地址 */
  path?: string

  /** 组件路径 */
  component?: string

  /** 路由参数 */
  query?: string

  /** 权限标识 */
  permission?: string

  /** 菜单图标 */
  icon?: string

  /** 是否显示（0是 1否） */
  isVisible: string

  /** 是否为外链（0是 1否） */
  isLink: string

  /** 是否为内嵌（0是 1否） */
  isFrame: string

  /** 是否缓存（0是 1否） */
  isCache: string
}

/**
 * 菜单树
 */
export interface MenuTreeResult extends MenuModel {
  /** 子节点 */
  children?: MenuTreeResult[]
}

/**
 * 路由树
 */
export interface RouterTreeResult {
  /** 菜单的名字 */
  name: string

  /** 路径,可以设定为网页链接 */
  path: string

  /** 菜单的 icon */
  icon: string

  /** 自定义菜单的国际化 key */
  locale: string | false

  /** 子菜单 */
  children: RouterTreeResult[]

  /** 在菜单中隐藏自己和子节点 */
  hideInMenu: boolean

  /** 在菜单中隐藏子节点 */
  hideChildrenInMenu: boolean

  /** 当此节点被选中的时候也会选中 parentKeys 的节点 */
  parentKeys: string[]

  [key: string]: any
}

/**
 * 添加菜单
 */
export type CreateMenuParams = Omit<MenuModel, 'menuId'>

/**
 * 更新菜单
 */
export type UpdateMenuParams = MenuModel
