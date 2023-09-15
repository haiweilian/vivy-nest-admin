import { getIcon } from '@/components/Icon'
import { AppRouteMenu } from '../types'

/**
 * 构建菜单
 * @param rawMenus 原始菜单
 * @returns 构建后的菜单
 */
export const buildMenus = (rawMenus: AppRouteMenu[]) => {
  rawMenus.forEach((menu) => {
    if (menu.icon && typeof menu.icon === 'string') {
      menu.icon = getIcon(menu.icon)
    }
    menu.children && buildMenus(menu.children)
  })
  return rawMenus
}
