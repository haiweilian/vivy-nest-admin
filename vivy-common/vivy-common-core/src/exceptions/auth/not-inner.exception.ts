import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * 未能通过的内部认证异常
 */
export class NotInnerException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN)
  }
}
