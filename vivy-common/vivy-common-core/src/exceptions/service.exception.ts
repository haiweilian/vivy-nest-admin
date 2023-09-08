import { HttpException, HttpStatus } from '@nestjs/common'

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

  constructor(msg: string, code?: number) {
    super(msg, HttpStatus.OK)
    this.code = code || HttpStatus.BAD_REQUEST
    this.message = msg
  }

  getCode(): number {
    return this.code
  }

  getMessage(): string {
    return this.message
  }
}
