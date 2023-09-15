import React from 'react'
import { Exception } from '@/components/Exception'
import { Redirect } from '@/components/Redirect'
import { AppRouteMenu } from '../types'

/**
 * 构建路由
 * @param rawRoutes 原始路由，由 Umi 自动生成
 * @param dynamicRoutes 动态路由，由 Api 接口返回
 * @implements 由动态路由表完全覆盖原始路由表，把原始路由信息按需补充到动态路由信息上
 */
export const buildRoutes = (rawRoutes: AppRouteMenu[], dynamicRoutes: AppRouteMenu[]) => {
  // 找到主布局路由，构建路径与组件的映射关系，并清空原始路由表
  const layout = rawRoutes.find((item) => item.isLayout)?.children || []
  const routeMap = new Map<string, React.ReactNode>()
  layout.forEach((child) => {
    routeMap.set(child.id!, child.element)
  })
  while (layout.length) {
    layout.pop()
  }

  // 转换路由，如果关闭全局布局添加到根路由下，反之添加到主布局路由下
  const routes = transformRoute(routeMap, dynamicRoutes)
  routes.forEach((route) => {
    if (route.layout === false) {
      rawRoutes.unshift(route)
    } else {
      layout.push(route)
    }
  })

  // DEBUG: 调试路由信息
  // console.log('调试路由信息', routeMap, routes)
}

/**
 * 转换路由
 * @param routeMap 路由映射
 * @param routeList 路由列表
 * @implements 通过组件路径找到组件元素
 */
function transformRoute(routeMap: Map<string, React.ReactNode>, routeList: AppRouteMenu[]) {
  routeList.forEach((route) => {
    const component = route.component
    if (component) {
      const element = routeMap.get(component)
      if (element) {
        route.element = element
      } else {
        route.element = <Exception title={`在 src/pages/ 下找不到 ${component}.tsx 请自行创建！`} />
        console.warn(`在 src/pages/ 下找不到 ${component}.tsx 请自行创建！`)
      }
    } else {
      if (route.redirect) {
        route.element = <Redirect path={route.redirect} />
      }
      // console.warn(`请正确配置路由 ${route.name} 的 component 属性！`)
    }
    route.children && transformRoute(routeMap, route.children)
  })
  return routeList
}
