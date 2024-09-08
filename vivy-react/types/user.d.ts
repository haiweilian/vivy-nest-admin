/**
 * 用户信息
 */
declare interface UserInfo {
  /**
   * 用户ID
   */
  userId: number

  /**
   * 部门ID
   */
  deptId: number

  /**
   * 用户账号
   */
  userName: string

  /**
   * 用户昵称
   */
  nickName: string

  /**
   * 用户类型（00系统用户）
   */
  userType: string

  /**
   * 用户邮箱
   */
  email: string

  /**
   * 手机号码
   */
  phonenumber: string

  /**
   * 用户性别（1男 2女 3保密）
   */
  sex: string

  /**
   * 头像地址
   */
  avatar: string

  /**
   * 密码
   */
  password: string

  /**
   * 用户状态（0正常 1停用 2删除）
   */
  status: string
}

/**
 * 登录信息
 */
declare interface LoginUserInfo {
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
   * 用户信息
   */
  sysUser: UserInfo
}
