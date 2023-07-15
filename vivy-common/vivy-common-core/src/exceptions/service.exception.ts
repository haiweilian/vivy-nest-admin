import { HttpException, HttpStatus } from '@nestjs/common'
import { isNumber, isString } from 'lodash'

/**
 * 业务逻辑异常
 */
export class ServiceException extends HttpException {
  /**
   * 业务错误码
   */
  code: number

  /**
   * 错误提示
   */
  message: string

  constructor(codeOrMsg: number | string, msg?: string) {
    super((msg || codeOrMsg) as string, HttpStatus.OK)

    const code = isNumber(codeOrMsg) ? codeOrMsg : HttpStatus.INTERNAL_SERVER_ERROR
    const message = isString(codeOrMsg) ? codeOrMsg : msg

    this.code = code
    this.message = message
  }

  getCode(): number {
    return this.code
  }

  getMessage(): string {
    return this.message
  }
}
