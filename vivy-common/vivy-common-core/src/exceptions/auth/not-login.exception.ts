import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * 未能通过的登录认证异常
 */
export class NotLoginException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
