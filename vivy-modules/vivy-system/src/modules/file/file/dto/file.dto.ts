import { OmitType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow } from 'class-validator'
import { SysFile } from '../entities/sys-file.entity'

/**
 * 查询文件
 */
export class ListFileDto extends PaginateDto {
  /** 文件用途 */
  @Allow()
  fileUse?: string

  /** 文件路径 */
  @Allow()
  fileUrl?: string
}

/**
 * 添加文件
 */
export class CreateFileDto extends OmitType(SysFile, ['fileId'] as const) {}

/**
 * 更新文件
 */
export class UpdateFileDto extends OmitType(SysFile, ['fileId'] as const) {}
