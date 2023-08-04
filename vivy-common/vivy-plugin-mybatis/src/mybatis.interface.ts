import { FormatOptionsWithLanguage } from 'sql-formatter'

export type MybatisFormat = FormatOptionsWithLanguage

export type MybatisParams = {
  [name: string]: string | string[] | number | number[] | boolean | null | undefined
}

export interface MybatisOptions {
  /**
   * 是否生成声明
   * @default true
   */
  dts?: boolean

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
  patterns?: string | string[]

  /**
   * 格式化SQL
   * @example https://www.npmjs.com/package/sql-formatter
   */
  format?: MybatisParams
}
