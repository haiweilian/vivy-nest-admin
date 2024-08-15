import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { MenuModel, MenuTreeResult, CreateMenuParams, UpdateMenuParams } from './model'
export * from './model'

/**
 * 查询菜单树
 */
export function treeMenu() {
  return request<MenuTreeResult[]>(`/menus/tree`, {
    method: RequestEnum.GET,
  })
}

/**
 * 添加菜单
 */
export function addMenu(params: CreateMenuParams) {
  return request(`/menus`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新菜单
 */
export function updateMenu(menuId: number, params: UpdateMenuParams) {
  return request(`/menus/${menuId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除菜单
 */
export function deleteMenu(menuId: number) {
  return request(`/menus/${menuId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询菜单详情
 */
export function infoMenu(menuId: number) {
  return request<MenuModel>(`/menus/${menuId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询菜单选项树
 */
export function menuTreeOptions() {
  return request<MenuTreeResult[]>(`/menus/treeOptions`, {
    method: RequestEnum.GET,
  })
}
