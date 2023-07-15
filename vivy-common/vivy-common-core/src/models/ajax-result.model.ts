import { HttpStatus } from '@nestjs/common'
import { isNumber, isString } from 'lodash'

/**
 * 响应对象
 */
export class AjaxResult<T = any> {
  /** 状态码 */
  code: number

  /** 数据 */
  data?: T

  /** 消息 */
  message?: string

  constructor(code: number, data?: any, message?: string) {
    this.code = code
    this.data = data
    this.message = message
  }

  /**
   * 返回成功
   * @param data 数据
   * @param msg 消息
   * @returns AjaxResult
   */
  static success<T>(data?: T, msg?: string): AjaxResult<T> {
    const code = HttpStatus.OK
    const message = msg || '操作成功'
    return new AjaxResult<T>(code, data, message)
  }

  /**
   * 返回失败
   * @param codeOrMsg 状态码/消息
   * @param msg 消息
   * @returns AjaxResult
   */
  static error<T>(codeOrMsg: number | string, msg?: string): AjaxResult<T> {
    const code = isNumber(codeOrMsg) ? codeOrMsg : HttpStatus.INTERNAL_SERVER_ERROR
    const message = isString(codeOrMsg) ? codeOrMsg : msg || '操作失败'
    return new AjaxResult<T>(code, null, message)
  }
}
