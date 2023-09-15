import { MenuDataItem } from '@ant-design/pro-components'

export type AppRouteMenu = MenuDataItem & {
  /** 子路由 */
  children?: AppRouteMenu[]

  /** 关闭全局布局 */
  layout?: false

  /** 重定向路由 */
  redirect?: string

  /** 组件元素 */
  element?: React.ReactNode

  /** 组件路径, 匹配的组件会赋值到 element 属性上 */
  component?: string
}
