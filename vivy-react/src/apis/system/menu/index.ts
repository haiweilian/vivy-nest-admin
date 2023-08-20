import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { MenuModel, MenuTreeResult, CreateMenuParams, UpdateMenuParams } from './model'
export * from './model'

/**
 * 查询菜单树
 */
export function treeMenu() {
  return request<MenuTreeResult[]>('/menu/tree', {
    method: RequestEnum.GET,
  })
}

/**
 * 添加菜单
 */
export function addMenu(params: CreateMenuParams) {
  return request('/menu/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新菜单
 */
export function updateMenu(params: UpdateMenuParams) {
  return request('/menu/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除菜单
 */
export function deleteMenu(menuId: React.Key) {
  return request(`/menu/delete/${menuId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询菜单详情
 */
export function infoMenu(menuId: React.Key) {
  return request<MenuModel>(`/menu/info/${menuId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询菜单选项树
 */
export function selectableMenuTree() {
  return request<MenuTreeResult[]>('/menu/selectable/menuTree', {
    method: RequestEnum.GET,
  })
}
