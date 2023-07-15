import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { LoggerService } from '@vivy-common/logger'
import { Response } from 'express'
import { ServiceException } from '../exceptions/service.exception'
import { AjaxResult } from '../models/ajax-result.model'

/**
 * 业务逻辑异常过滤器
 */
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    this.logger.error(exception.getMessage(), exception.stack, ServiceExceptionFilter.name)
    response.status(HttpStatus.OK).json(AjaxResult.error(exception.getCode(), exception.getMessage()))
  }
}
