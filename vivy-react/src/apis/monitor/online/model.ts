/**
 * 查询在线用户
 */
export interface ListOnlineParams {
  /** IP地址 */
  loginIp?: string

  /** 用户名称 */
  userName?: string
}

/**
 * 在线用户信息
 */
export interface OnlineInfoResult {
  /** 会话Key */
  userSk: string

  /** 用户Id */
  userId: number

  /** 用户名称 */
  userName: string

  /** 用户昵称 */
  nickName: string

  /** 登录IP */
  loginIp: string

  /** 登录时间 */
  loginTime: string
}
