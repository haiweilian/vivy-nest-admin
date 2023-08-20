/**
 * 操作日志
 */
export interface OperLogModel extends BaseTimeEntity {
  /** 操作ID */
  operId: number

  /** 模块标题 */
  title: string

  /** 操作类型 */
  operType: number

  /** 操作人员 */
  operName: string

  /** 方法名称 */
  operMethod: string

  /** 主机地址 */
  operIp?: string

  /** 操作地点 */
  operLocation?: string

  /** 操作状态 */
  operStatus: number

  /** 请求URL */
  requestUrl: string

  /** 请求方式 */
  requestMethod: string

  /** 请求参数 */
  requestParam?: string

  /** 请求返回结果 */
  requestResult?: string

  /** 请求错误消息 */
  requestErrmsg?: string
}

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
