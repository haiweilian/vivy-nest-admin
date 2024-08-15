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

  /** 是否显示（0否 1是） */
  isVisible: string

  /** 是否为外链（0否 1是） */
  isLink: string

  /** 是否为内嵌（0否 1是） */
  isFrame: string

  /** 是否缓存（0否 1是） */
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
 * 添加菜单
 */
export type CreateMenuParams = Omit<MenuModel, 'menuId'>

/**
 * 更新菜单
 */
export type UpdateMenuParams = Omit<MenuModel, 'menuId'>
