import { GenTableResult } from './model-result'

/**
 * 查询代码生成
 */
export interface ListGenParams extends PaginateParams {
  /** 表名称 */
  tableName?: string

  /** 表注释 */
  tableComment?: string
}

/**
 * 更新代码生成
 */
export type UpdateGenParams = GenTableResult
