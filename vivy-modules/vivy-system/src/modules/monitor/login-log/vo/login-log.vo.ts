import { SysLoginLog } from '../entities/sys-login-log.entity'

/**
 * 查询登录日志
 */
export class LoginLogListVo extends SysLoginLog {
  /** 操作系统 */
  os: string

  /** 浏览器信息 */
  browser: string
}
