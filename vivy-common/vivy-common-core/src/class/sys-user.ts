import { BaseBusinessEntity } from '../entities/base-business.entity'

/**
 * 用户信息
 */
export class SysUser extends BaseBusinessEntity {
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
   * 用户性别（0男 1女 2未知）
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
   * 用户状态（0正常 1停用）
   */
  status: string
}
