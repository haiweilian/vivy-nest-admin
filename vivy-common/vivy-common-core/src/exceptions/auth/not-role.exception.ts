import { HttpStatus } from '@nestjs/common'
import { isArray } from 'lodash'
import { ServiceException } from '../service.exception'

/**
 * 未能通过的角色认证异常
 */
export class NotRoleException extends ServiceException {
  constructor(roles: string | string[]) {
    const message = isArray(roles) ? roles.join(',') : roles
    super(message, HttpStatus.FORBIDDEN)
  }
}
