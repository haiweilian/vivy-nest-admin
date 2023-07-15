import { SysUser } from './sys-user.model'

/**
 * 登录信息
 */
export class SysLoginUser {
  /**
   * 用户会话Key
   */
  userSk: string

  /**
   * 用户Id
   */
  userId: number

  /**
   * 用户名
   */
  userName: string

  /**
   * 登录时间
   */
  loginTime: number

  /**
   * 过期时间
   */
  expireTime: number

  /**
   * 登录IP地址
   */
  ipaddr: string

  /**
   * 权限列表
   */
  permissions: string[]

  /**
   * 角色列表
   */
  roles: string[]

  /**
   * 用户信息
   */
  sysUser: SysUser
}
