import { request } from '@umijs/max'
import type { DeptTreeVo, SysDept, CreateDeptDto, UpdateDeptDto } from '@/apis/types/system/dept'
import { RequestEnum } from '@/enums/httpEnum'

/**
 * 查询部门树
 */
export function treeDept() {
  return request<DeptTreeVo[]>('/system/dept/tree', {
    method: RequestEnum.GET,
  })
}

/**
 * 添加部门
 */
export function addDept(params: Partial<CreateDeptDto>) {
  return request('/system/dept/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新部门
 */
export function updateDept(params: Partial<UpdateDeptDto>) {
  return request('/system/dept/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除部门
 */
export function deleteDept(deptId: React.Key) {
  return request(`/system/dept/delete/${deptId}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 获取部门详情
 */
export function infoDept(deptId: React.Key) {
  return request<SysDept>(`/system/dept/info/${deptId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 查询部门选项树
 */
export function selectableDept() {
  return request<DeptTreeVo[]>('/system/dept/tree/selectable', {
    method: RequestEnum.GET,
  })
}
