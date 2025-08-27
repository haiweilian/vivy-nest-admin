import { Injectable, HttpStatus, StreamableFile, Inject } from '@nestjs/common'
import type { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SecurityConstants, AjaxResult, IpUtils, BaseStatusEnum } from '@vivy-common/core'
import { Request } from 'express'
import { Observable, tap, catchError, throwError } from 'rxjs'
import { LogOptions } from '../decorators/log.decorator'
import { LOGGER_LOG_METADATA } from '../logger.constants'
import { OperLogDto } from '../services/dto/oper-log.dto'
import { RpcLogService } from '../services/rpc-log.service'

/**
 * 自定义操作日志记录拦截器
 * 注意：使用此拦截器可在具体的项目中继承此拦截器并实现服务调用(RpcLogService)
 */
@Injectable()
export class LogInterceptor implements NestInterceptor {
  @Inject()
  private reflector: Reflector

  constructor(private rpcLogService: RpcLogService) {}

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
      operLog.requestParam = JSON.stringify(request.body)?.slice(0, 2000)
    }
    if (meta.isSaveResponseData && !isStreamableFile) {
      operLog.requestResult = JSON.stringify(result)?.slice(0, 2000)
    }

    if (isStreamableFile || result.code === HttpStatus.OK) {
      operLog.operStatus = BaseStatusEnum.NORMAL
      operLog.requestErrmsg = undefined
    } else {
      operLog.operStatus = BaseStatusEnum.DISABLE
      operLog.requestErrmsg = result.message
    }

    this.rpcLogService.add(operLog).catch(() => {
      // Do not handle errors
    })
  }
}
