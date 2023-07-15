import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { LoggerService } from '@vivy-common/logger'
import { Response } from 'express'
import { isArray, isString } from 'lodash'
import { AjaxResult } from '../models/ajax-result.model'

/**
 * 未知异常过滤器
 */
@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const code = this.initCode(exception)
    const { cause, message } = this.initMessage(exception)

    this.logger.error(cause, exception.stack, UnknownExceptionFilter.name)
    response.status(HttpStatus.OK).json(AjaxResult.error(code, message))
  }

  private initCode(exception: Error) {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  private initMessage(exception: Error) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any
      if (isString(response)) {
        return {
          cause: response,
          message: response,
        }
      } else if (isString(response?.message)) {
        return {
          cause: response.message,
          message: response.message,
        }
      } else if (isArray(response?.message)) {
        return {
          cause: JSON.stringify(response.message),
          message: response.message[0],
        }
      } else {
        return {
          cause: response ? JSON.stringify(response) : exception.message,
          message: exception.message,
        }
      }
    } else {
      return {
        cause: exception.message,
        message: '服务异常，请稍后再试',
      }
    }
  }
}
