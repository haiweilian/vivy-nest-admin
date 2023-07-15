import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { LoggerService } from '@vivy-common/logger'
import { Response } from 'express'
import { NotRoleException } from '../../exceptions/auth/not-role.exception'
import { AjaxResult } from '../../models/ajax-result.model'

/**
 * 角色认证异常过滤器
 */
@Catch(NotRoleException)
export class NotRoleExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(`角色权限校验失败${exception.message}`, exception.stack, NotRoleExceptionFilter.name)
    response.status(HttpStatus.OK).json(AjaxResult.error(HttpStatus.FORBIDDEN, '没有访问权限，请联系管理员授权'))
  }
}
