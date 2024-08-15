import { request } from '@umijs/max'
import { RequestEnum } from '@/enums/httpEnum'
import type { CreateDeptParams, UpdateDeptParams, DeptModel, DeptTreeResult } from './model'
export * from './model'

/**
 * 查询部门树
 */
export function treeDept() {
  return request<DeptTreeResult[]>(`/depts/tree`, {
    method: RequestEnum.GET,
  })
}

/**
 * 添加部门
 */
export function addDept(params: CreateDeptParams) {
  return request(`/depts`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新部门
 */
export function updateDept(deptId: number, params: UpdateDeptParams) {
  return request(`/depts/${deptId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除部门
 */
export function deleteDept(deptId: number) {
  return request(`/depts/${deptId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询部门详情
 */
export function infoDept(deptId: number) {
  return request<DeptModel>(`/depts/${deptId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询部门选项树
 */
export function deptTreeOptions() {
  return request<DeptTreeResult[]>(`/depts/treeOptions`, {
    method: RequestEnum.GET,
  })
}
