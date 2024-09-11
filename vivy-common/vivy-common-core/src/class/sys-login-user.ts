import { SysUser } from './sys-user'

class DataScope {
  /**
   * 角色Id
   */
  roleId: number

  /**
   * 数据范围
   */
  dataScope: string
}

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
  loginIp: string

  /**
   * 权限列表
   */
  permissions: string[]

  /**
   * 角色列表
   */
  roles: string[]

  /**
   * 数据范围
   */
  scopes: DataScope[]

  /**
   * 用户信息
   */
  sysUser: SysUser
}
