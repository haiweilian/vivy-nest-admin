import { request } from '@umijs/max'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { CreateFileParams, ListFileParams, UpdateFileParams, FileModel, UploadFileResult } from './model'
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
export function addFile(params: CreateFileParams) {
  return request(`/files`, {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新文件
 */
export function updateFile(fileId: number, params: UpdateFileParams) {
  return request(`/files/${fileId}`, {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除文件
 */
export function deleteFile(fileIds: number | string) {
  return request(`/files/${fileIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询文件详情
 */
export function infoFile(fileId: number) {
  return request<FileModel>(`/files/${fileId}`, {
    method: RequestEnum.GET,
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
  return request<UploadFileResult>(`/files/upload`, {
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
export function uploadsFile(data: FormData) {
  return request<UploadFileResult[]>(`/files/uploads`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  })
}
