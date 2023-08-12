/**
 * 查询操作日志
 */
export interface ListOperLogParams extends PaginateParams {
  /** 模块标题 */
  title?: string

  /** 操作类型(enum OperType) */
  operType?: number

  /** 操作人员 */
  operName?: string

  /** 操作状态(enum OperStatus) */
  operStatus?: number

  /** 请求地址 */
  requestUrl?: string

  /** 操作时间 */
  createTime?: string[]
}
