import { HttpStatus } from '@nestjs/common'
import { isArray } from 'lodash'
import { ServiceException } from '../service.exception'

/**
 * 未能通过的权限认证异常
 */
export class NotPermissionException extends ServiceException {
  constructor(permissions: string | string[]) {
    const message = isArray(permissions) ? permissions.join(',') : permissions
    super(message, HttpStatus.FORBIDDEN)
  }
}
