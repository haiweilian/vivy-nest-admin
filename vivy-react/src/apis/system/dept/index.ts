import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { CreateDeptParams, UpdateDeptParams, DeptModel, DeptTreeResult } from './model'
export * from './model'

/**
 * 查询部门树
 */
export function treeDept() {
  return request<DeptTreeResult[]>('/dept/tree', {
    method: RequestEnum.GET,
  })
}

/**
 * 添加部门
 */
export function addDept(params: CreateDeptParams) {
  return request('/dept/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新部门
 */
export function updateDept(params: UpdateDeptParams) {
  return request('/dept/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除部门
 */
export function deleteDept(deptId: React.Key) {
  return request(`/dept/delete/${deptId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询部门详情
 */
export function infoDept(deptId: React.Key) {
  return request<DeptModel>(`/dept/info/${deptId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询部门选项树
 */
export function optionDeptTree() {
  return request<DeptTreeResult[]>('/dept/option/tree', {
    method: RequestEnum.GET,
  })
}
