import { HttpStatus } from '@nestjs/common'
import { ServiceException } from '../service.exception'

/**
 * 未能通过的登录认证异常
 */
export class NotLoginException extends ServiceException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
