import { request } from '@umijs/max'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'
import { CreateFileParams, ListFileParams, UpdateFileParams, FileModel, UploadFileResult } from './model'
export * from './model'

/**
 * 查询文件列表
 */
export function listFile(params: ListFileParams) {
  return request<Pagination<FileModel>>('/file/list', {
    method: RequestEnum.GET,
    params,
  })
}

/**
 * 添加文件
 */
export function addFile(params: CreateFileParams) {
  return request('/file/add', {
    method: RequestEnum.POST,
    data: params,
  })
}

/**
 * 更新文件
 */
export function updateFile(params: UpdateFileParams) {
  return request('/file/update', {
    method: RequestEnum.PUT,
    data: params,
  })
}

/**
 * 删除文件
 */
export function deleteFile(fileIds: React.Key) {
  return request(`/file/delete/${fileIds}`, {
    method: RequestEnum.DELETE,
  })
}

/**
 * 查询文件详情
 */
export function infoFile(fileId: React.Key) {
  return request<FileModel>(`/file/info/${fileId}`, {
    method: RequestEnum.GET,
  })
}

/**
 * 文件用途选项
 */
export function fileUseOptions() {
  return request<string[]>(`/file/use/options`, {
    method: RequestEnum.GET,
  })
}

/**
 * 单个文件上传
 */
export function uploadFile(data: FormData) {
  return request<UploadFileResult>(`/file/upload`, {
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
  return request<UploadFileResult[]>(`/file/uploads`, {
    method: RequestEnum.POST,
    data,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
  })
}
