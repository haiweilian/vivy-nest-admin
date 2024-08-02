/**
 * 文件信息
 */
export interface FileModel {
  /** 文件ID */
  fileId: number

  /** 文件用途 */
  fileUse: string

  /** 文件路径 */
  fileUrl: string

  /** 文件名称 */
  fileName: string

  /** 文件原始名称 */
  fileOriginalName: string

  /** 文件大小 */
  fileSize: number

  /** 文件类型 */
  fileType: string
}

/**
 * 查询文件
 */
export interface ListFileParams extends PaginateParams {
  /** 文件用途 */
  fileUse?: string

  /** 文件路径 */
  fileUrl?: string

  /** 文件名称 */
  fileName?: string

  /** 文件原始名称 */
  fileOriginalName?: string

  /** 文件大小 */
  fileSize?: number

  /** 文件类型 */
  fileType?: string
}

/**
 * 添加文件
 */
export type CreateFileParams = Omit<FileModel, 'fileId'>

/**
 * 更新文件
 */
export type UpdateFileParams = FileModel

/**
 * 上传文件信息
 */
export interface UploadFileResult {
  /** 文件路径 */
  fileUrl: string

  /** 文件名称 */
  fileName: string

  /** 文件原始名称 */
  fileOriginalName: string

  /** 文件大小 */
  fileSize: number

  /** 文件类型 */
  fileType: string
}
