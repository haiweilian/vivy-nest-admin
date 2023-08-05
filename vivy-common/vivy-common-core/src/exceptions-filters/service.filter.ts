import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import { AjaxResult } from '../class/ajax-result'
import { ServiceException } from '../exceptions/service.exception'

/**
 * 业务逻辑异常过滤器
 */
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private logger = new Logger(ServiceExceptionFilter.name)

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(exception.getMessage(), exception.stack)
    response.status(HttpStatus.OK).json(AjaxResult.error(exception.getMessage(), exception.getCode()))
  }
}
