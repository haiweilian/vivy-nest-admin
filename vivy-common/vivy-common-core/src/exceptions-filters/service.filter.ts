import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { AjaxResult } from '../class/ajax-result'
import { NotPermissionException } from '../exceptions/auth/not-permission.exception'
import { NotRoleException } from '../exceptions/auth/not-role.exception'
import { ServiceException } from '../exceptions/service.exception'
import { ValidatorException } from '../exceptions/validator.exception'

/**
 * 业务逻辑异常过滤器
 */
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ServiceExceptionFilter.name)

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    response.status(HttpStatus.OK)

    if (exception instanceof NotRoleException) {
      return response.json(this.NotRoleException(exception, request))
    }

    if (exception instanceof NotPermissionException) {
      return response.json(this.NotPermissionException(exception, request))
    }

    if (exception instanceof ValidatorException) {
      return response.json(this.ValidatorException(exception, request))
    }

    return response.json(this.DefaultException(exception, request))
  }

  /**
   * 默认异常
   */
  private DefaultException(exception: NotRoleException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: exception.getMessage() })
    return AjaxResult.error(exception.getMessage(), exception.getCode())
  }

  /**
   * 未能通过的角色认证异常
   */
  private NotRoleException(exception: NotRoleException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: `角色权限校验失败：${exception.getMessage()}` })
    return AjaxResult.error('没有访问权限，请联系管理员授权', exception.getCode())
  }

  /**
   * 未能通过的权限认证异常
   */
  private NotPermissionException(exception: NotPermissionException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: `权限码校验失败：${exception.getMessage()}` })
    return AjaxResult.error('没有访问权限，请联系管理员授权', exception.getCode())
  }

  /**
   * 未能通过的验证异常
   */
  private ValidatorException(exception: NotPermissionException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, body: request.body, query: request.query, message: exception.getMessage() })
    return AjaxResult.error(exception.getMessage(), exception.getCode())
  }
}
