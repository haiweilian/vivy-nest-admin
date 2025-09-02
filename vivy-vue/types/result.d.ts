/**
 * 响应对象
 */
declare interface AjaxResult<T = any> {
  /** 状态码 */
  code: number

  /** 数据 */
  data?: T

  /** 消息 */
  message?: string
}
