import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { LogInterceptor } from '@vivy-common/logger'
import { OperLogService } from '@/modules/system/oper-log/oper-log.service'

/**
 * 操作日志记录拦截器
 */
@Injectable()
export class SysLogInterceptor extends LogInterceptor {
  constructor(reflector: Reflector, operLogService: OperLogService) {
    super(reflector, operLogService)
  }
}
