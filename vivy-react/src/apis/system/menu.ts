import { request } from '@umijs/max'
import type { SysMenu, MenuTreeVo, CreateMenuDto, UpdateMenuDto } from '@/apis/types/system/menu'
import { RequestEnum } from '@/enums/httpEnum'

/**
 * 查询菜单树
 */
export function treeMenu() {
  return request<MenuTreeVo[]>('/system/menu/tree', {
    method: RequestEnum.GET,
  })
}

/**
 * 添加菜单
 */
export function addMenu(params: Partial<CreateMenuDto>) {
  return request('/system/menu/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新菜单
 */
export function updateMenu(params: Partial<UpdateMenuDto>) {
  return request('/system/menu/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除菜单
 */
export function deleteMenu(menuId: React.Key) {
  return request(`/system/menu/delete/${menuId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 获取菜单详情
 */
export function infoMenu(menuId: React.Key) {
  return request<SysMenu>(`/system/menu/info/${menuId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询菜单选项树
 */
export function selectableMenu() {
  return request<MenuTreeVo[]>('/system/menu/tree/selectable', {
    method: RequestEnum.GET,
  })
}
