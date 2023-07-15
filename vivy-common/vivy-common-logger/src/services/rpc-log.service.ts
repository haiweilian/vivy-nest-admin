import { Injectable } from '@nestjs/common'
import { OperLogDto } from './dto/oper-log.dto'

/**
 * 远程日志服务调用
 */
@Injectable()
export class RpcLogService {
  /**
   * 添加操作日志
   * @param operLog 操作日志信息
   */
  async saveOperLog(operLog: OperLogDto) {
    console.log('远程日志服务调用', operLog)
  }
}
