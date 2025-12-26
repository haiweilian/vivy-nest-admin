import type OSS from 'ali-oss'
import { Allow } from 'class-validator'

export const UPLOAD_OPTIONS = Symbol('UPLOAD_OPTIONS')
export const UPLOAD_FILE_URL = 'fileurl'

/**
 * 上传配置
 */
export interface UploadOptions {
  /**
   * 上传路径
   */
  path: string
  /**
   * 访问前缀
   */
  prefix: string
  /**
   * 访问域名
   */
  domain?: string
}

/**
 * 上传配置 Oss
 */
export interface UploadOssOptions extends OSS.Options {
  /**
   * 访问域名
   */
  domain?: string
}

/**
 * 客户端动态配置
 */
export class UploadClientOptions {
  /**
   * 自定义路径
   * @description 前台传入自定义路径，与基础上传路径拼接
   * @example formData.set('path', 'avatar')
   */
  @Allow()
  path?: string
}
