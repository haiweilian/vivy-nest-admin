import { HttpStatus } from '@nestjs/common'

/**
 * 响应对象
 */
export class AjaxResult<T = any> {
  /** 状态码 */
  code: number

  /** 响应数据 */
  data?: T

  /** 响应消息 */
  message?: string

  constructor(data: any, code: number, message: string) {
    this.data = data
    this.code = code
    this.message = message
  }

  /**
   * 返回成功
   * @param data 数据
   * @param msg 消息
   * @returns AjaxResult
   */
  static success<T = any>(data?: T, msg?: string): AjaxResult<T> {
    const code = HttpStatus.OK
    const message = msg || '操作成功'
    return new AjaxResult<T>(data, code, message)
  }

  /**
   * 返回失败
   * @param msg 消息
   * @param code 状态码
   * @returns AjaxResult
   */
  static error<T = null>(msg?: string, code?: number): AjaxResult<T> {
    code = code || HttpStatus.INTERNAL_SERVER_ERROR
    const message = msg || '操作失败'
    return new AjaxResult<T>(null, code, message)
  }
}
