/**
 * 登录日志
 */
export interface LoginLogResult extends BaseTimeEntity {
  /** 登录ID */
  loginId: number

  /** 用户账号 */
  loginName: string

  /** 登录类型 */
  loginType: number

  /** 登录状态 */
  loginStatus: number

  /** 主机地址 */
  loginIp?: string

  /** 登录地点 */
  loginLocation?: string

  /** 登录信息 */
  loginMessage?: string

  /** 用户代理 */
  userAgent?: string
}

/**
 * 登录日志列表
 */
export interface LoginLogListResult extends LoginLogResult {
  /** 操作系统 */
  os: string

  /** 浏览器信息 */
  browser: string
}
