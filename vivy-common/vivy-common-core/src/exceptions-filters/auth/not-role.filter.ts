import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { AjaxResult } from '../../class/ajax-result'
import { NotRoleException } from '../../exceptions/auth/not-role.exception'

/**
 * 角色认证异常过滤器
 */
@Catch(NotRoleException)
export class NotRoleExceptionFilter implements ExceptionFilter {
  private logger = new Logger(NotRoleExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(`角色权限校验失败${exception.message}`, exception.stack)
    response.status(HttpStatus.OK).json(AjaxResult.error('没有访问权限，请联系管理员授权', HttpStatus.FORBIDDEN))
  }
}
