import { HttpStatus } from '@nestjs/common'
import { ServiceException } from '../service.exception'

/**
 * 未能通过的内部认证异常
 */
export class NotInnerException extends ServiceException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN)
  }
}
