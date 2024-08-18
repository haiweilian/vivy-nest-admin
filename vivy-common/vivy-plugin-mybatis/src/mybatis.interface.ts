import { FactoryProvider } from '@nestjs/common'
import { FormatOptionsWithLanguage } from 'sql-formatter'

export type MybatisFormat = FormatOptionsWithLanguage

export type MybatisParams = {
  [name: string]: string | string[] | number | number[] | boolean | null | undefined
}

export interface MybatisOptions {
  /**
   * 基础工作目录
   * @default process.cwd()
   */
  cwd?: string
  /**
   * 生成声明文件
   * @default true
   */
  dts?: boolean | string
  /**
   * 是否监听文件变化
   * @default true
   */
  watch?: boolean
  /**
   * 匹配的文件
   * @default []
   * @example https://www.npmjs.com/package/fast-glob
   */
  globs?: string | string[]
  /**
   * 格式化SQL
   * @example https://www.npmjs.com/package/sql-formatter
   */
  format?: MybatisFormat
}

export interface MybatisAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<MybatisOptions> | MybatisOptions
  inject?: FactoryProvider['inject']
}
