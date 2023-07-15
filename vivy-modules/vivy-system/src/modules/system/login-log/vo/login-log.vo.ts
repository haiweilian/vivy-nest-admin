import { SysLoginLog } from '@/entities/sys-login-log.entity'

/**
 * 登录日志列表
 */
export class ListLoginLogVo extends SysLoginLog {
  /** 操作系统 */
  os: string

  /** 浏览器信息 */
  browser: string
}
