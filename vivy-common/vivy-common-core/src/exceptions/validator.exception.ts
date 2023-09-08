import { HttpStatus } from '@nestjs/common'
import { ServiceException } from './service.exception'

/**
 * 未能通过的验证异常
 */
export class ValidatorException extends ServiceException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST)
  }
}

/**
 * 未能通过的验证异常
 */
export const ValidatorExceptionFactory = (error: string) => {
  return new ValidatorException(error)
}
