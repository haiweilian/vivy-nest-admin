import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  HttpException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AjaxResult } from '../class/ajax-result'

/**
 * 未知异常过滤器
 */
@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnknownExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    response.status(HttpStatus.OK)

    if (exception instanceof NotFoundException) {
      return response.json(this.NotFoundException(exception, request))
    }

    if (exception instanceof RequestTimeoutException) {
      return response.json(this.RequestTimeoutException(exception, request))
    }

    return response.json(this.DefaultException(exception, request))
  }

  /**
   * 默认异常
   */
  private DefaultException(exception: Error, request: Request): AjaxResult {
    const response = exception instanceof HttpException ? exception.getResponse() : undefined
    this.logger.error({ message: exception.message, response }, exception.stack)
    return AjaxResult.error('服务异常，请稍后重试', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 资源不存在异常
   */
  private NotFoundException(exception: NotFoundException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: exception.message })
    return AjaxResult.error('请求资源不存在，请稍后重试', exception.getStatus())
  }

  /**
   * 请求超时异常
   */
  private RequestTimeoutException(exception: RequestTimeoutException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: exception.message })
    return AjaxResult.error('请求超时，请稍后重试', exception.getStatus())
  }
}
