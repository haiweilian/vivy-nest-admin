import { Injectable } from '@nestjs/common'
import { LogInterceptor } from '@vivy-common/logger'
import { OperLogService } from '@/modules/monitor/oper-log/oper-log.service'

/**
 * 操作日志记录拦截器
 */
@Injectable()
export class SysLogInterceptor extends LogInterceptor {
  constructor(operLogService: OperLogService) {
    super(operLogService)
  }
}
