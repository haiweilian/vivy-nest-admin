import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { LoggerService } from '@vivy-common/logger'
import { Response } from 'express'
import { NotPermissionException } from '../../exceptions/auth/not-permission.exception'
import { AjaxResult } from '../../models/ajax-result.model'

/**
 * 权限认证异常过滤器
 */
@Catch(NotPermissionException)
export class NotPermissionExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(`权限码校验失败:${exception.message}`, exception.stack, NotPermissionExceptionFilter.name)
    response.status(HttpStatus.OK).json(AjaxResult.error(HttpStatus.FORBIDDEN, '没有访问权限，请联系管理员授权'))
  }
}
