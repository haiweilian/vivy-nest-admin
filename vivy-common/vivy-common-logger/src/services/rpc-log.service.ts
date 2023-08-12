import { Injectable } from '@nestjs/common'
import { OperLogDto } from './dto/oper-log.dto'

/**
 * 远程日志服务调用
 * 备注：如果在分布式架构中需要整合操作日志在此远程调用
 */
@Injectable()
export class RpcLogService {
  /**
   * 添加操作日志
   * @param operLog 操作日志信息
   */
  async add(operLog: OperLogDto) {
    console.log('远程日志服务调用', operLog)
  }
}
