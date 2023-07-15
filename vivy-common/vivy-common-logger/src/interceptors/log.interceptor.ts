import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, StreamableFile } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SecurityConstants } from '@vivy-common/core/lib/constants'
import { AjaxResult } from '@vivy-common/core/lib/models'
import { IpUtils } from '@vivy-common/core/lib/utils'
import { Request } from 'express'
import { Observable, tap, catchError, throwError } from 'rxjs'
import { LogOptions } from '../decorators/log.decorator'
import { OperStatus } from '../enums/oper-status.enum'
import { LOGGER_LOG_METADATA } from '../logger.constants'
import { OperLogDto } from '../services/dto/oper-log.dto'
import { RpcLogService } from '../services/rpc-log.service'

/**
 * 自定义操作日志记录拦截器
 */
@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private rpcLogService: RpcLogService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((res) => {
        this.saveOperLog(context, res)
      }),
      catchError((err: Error) => {
        this.saveOperLog(context, AjaxResult.error(err.message))
        return throwError(() => err)
      })
    )
  }

  /**
   * 保存操作日志
   * @param context ExecutionContext
   * @param result AjaxResult | StreamableFile
   * @returns
   */
  private saveOperLog(context: ExecutionContext, result: AjaxResult | StreamableFile) {
    const meta = this.reflector.get<LogOptions>(LOGGER_LOG_METADATA, context.getHandler())
    if (!meta) return

    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const operLog = new OperLogDto()
    const isStreamableFile = result instanceof StreamableFile

    operLog.title = meta.title
    operLog.operType = meta.operType
    operLog.operMethod = `${context.getClass().name}.${context.getHandler().name}()`

    const region = IpUtils.ip2Region(IpUtils.requestIp(request))
    operLog.operIp = IpUtils.requestIp(request)
    operLog.operLocation = `${region.country} ${region.province} ${region.city}`
    operLog.operName = request[SecurityConstants.USER_NAME]

    operLog.requestUrl = request.url
    operLog.requestMethod = request.method
    if (meta.isSaveRequestData) {
      operLog.requestParam = JSON.stringify(request.body)
    }
    if (meta.isSaveResponseData && !isStreamableFile) {
      operLog.requestResult = JSON.stringify(result)
    }

    if (isStreamableFile || result.code === HttpStatus.OK) {
      operLog.operStatus = OperStatus.OK
      operLog.requestErrmsg = undefined
    } else {
      operLog.operStatus = OperStatus.FAIL
      operLog.requestErrmsg = result.message
    }

    this.rpcLogService.saveOperLog(operLog).catch(() => {
      // Do not handle errors
    })
  }
}
