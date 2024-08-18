import { request } from '@umijs/max'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { CreateFileParams, ListFileParams, FileModel } from './model'
export * from './model'

/**
 * 查询文件列表
 */
export function listFile(params: ListFileParams) {
  return request<Pagination<FileModel>>(`/files`, {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加文件
 */
export function addFile(params: CreateFileParams | CreateFileParams[]) {
  return request(`/files`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 文件用途选项
 */
export function fileUseOptions() {
  return request<string[]>(`/files/useOptions`, {
    method: RequestEnum.GET,
  })
}

/**
 * 单个文件上传
 */
export function uploadFile(data: FormData) {
  return request<string>(`/files/upload`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  })
}

/**
 * 多个文件上传
 */
export function uploadFiles(data: FormData) {
  return request<string[]>(`/files/uploads`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  })
}
