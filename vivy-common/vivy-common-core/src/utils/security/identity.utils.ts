import { UserConstants } from '../../constants'

/**
 * 身份判断方法
 */
export class IdentityUtils {
  /**
   * 是否是管理员
   * @param userId 用户Id
   * @returns true 是 / false 否
   */
  static isAdmin(userId: number) {
    return IdentityUtils.isAdminUser(userId)
  }

  /**
   * 是否是管理员用户
   * @param userId 用户Id
   * @returns true 是 / false 否
   */
  static isAdminUser(userId: number) {
    return Number(userId) === UserConstants.SUPER_USER
  }

  /**
   * 是否是管理员角色
   * @param roleId 角色Id
   * @returns true 是 / false 否
   */
  static isAdminRole(roleId: number) {
    return Number(roleId) === UserConstants.SUPER_ROLE
  }
}
