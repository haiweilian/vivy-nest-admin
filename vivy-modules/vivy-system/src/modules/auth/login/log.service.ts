import { Injectable } from '@nestjs/common'
import { BaseStatusEnum, IpUtils, RequestContext } from '@vivy-common/core'
import { LoginType } from '@/common/enums/login-type.enum'
import { CreateLoginLogDto } from '@/modules/monitor/login-log/dto/login-log.dto'
import { LoginLogService } from '@/modules/monitor/login-log/login-log.service'

@Injectable()
export class LogService {
  constructor(
    private requestContext: RequestContext,
    private loginLogService: LoginLogService
  ) {}

  /**
   * 登录成功
   * @param type 登录类型
   * @param name 用户名称
   * @param message 登录消息
   */
  ok(type: LoginType, name: string, message: string) {
    this.saveLoginLog(type, name, BaseStatusEnum.NORMAL, message)
  }

  /**
   * 登录失败
   * @param type 登录类型
   * @param name 用户名称
   * @param message 登录消息
   */
  fail(type: LoginType, name: string, message: string) {
    this.saveLoginLog(type, name, BaseStatusEnum.DISABLE, message)
  }

  /**
   * 登录日志保存
   * @param type 登录类型
   * @param name 用户名称
   * @param status 登录状态
   * @param message 登录消息
   */
  private saveLoginLog(type: LoginType, name: string, status: BaseStatusEnum, message: string) {
    const loginLog = new CreateLoginLogDto()
    loginLog.loginName = name
    loginLog.loginType = type
    loginLog.loginStatus = status
    loginLog.loginMessage = message

    const request = this.requestContext.getRequest()
    const region = IpUtils.ip2Region(IpUtils.requestIp(request))
    loginLog.loginIp = IpUtils.requestIp(request)
    loginLog.loginLocation = `${region.country} ${region.province} ${region.city}`
    loginLog.userAgent = request.headers['user-agent']

    this.loginLogService.add(loginLog).catch(() => {
      // Do not handle errors
    })
  }
}
