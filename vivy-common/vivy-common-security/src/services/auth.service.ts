import { Injectable } from '@nestjs/common'
import {
  SysLoginUser,
  UserConstants,
  NotLoginException,
  NotPermissionException,
  NotRoleException,
  SecurityContext,
} from '@vivy-common/core'
import { Logical } from '../enums/logical.enums'
import { RequireMetadata } from '../interfaces/require-metadata.interface'

/**
 * 权限验证工具类
 */
@Injectable()
export class AuthService {
  constructor(private securityContext: SecurityContext) {}

  /**
   * 检验用户是否已经登录，如未登录，则抛出异常: NotLoginException
   */
  checkLogin() {
    this.getLoginUser()
  }

  /**
   * 获取当前用户缓存信息, 如果未登录，则抛出异常: NotLoginException
   */
  getLoginUser(): SysLoginUser {
    const token = this.securityContext.getToken()
    if (!token) {
      throw new NotLoginException('令牌不能为空')
    }

    const loginUser = this.securityContext.getLoginUser()
    if (!loginUser) {
      throw new NotLoginException('令牌已过期或验证不正确！')
    }

    return loginUser
  }

  /**
   * 获取当前用户的角色列表
   */
  getRoleList(): string[] {
    try {
      return this.getLoginUser().roles
    } catch (error) {
      return []
    }
  }

  /**
   * 判断是否包含角色
   * @param roles 角色列表
   * @param role 角色
   * @returns 用户是否具备某角色权限
   */
  inRole(roles: string[], role: string): boolean {
    return roles.includes(UserConstants.SUPER_ROLE_CODE) || roles.includes(role)
  }

  /**
   * 判断用户是否拥有某个角色
   * @param role 角色标识
   * @returns 用户是否具备某角色
   */
  hasRole(role: string): boolean {
    return this.inRole(this.getRoleList(), role)
  }

  /**
   * 判断用户是否拥有某个角色。如果验证未通过，则抛出异常: NotRoleException
   * @param role 角色标识
   */
  checkRole(role: string) {
    if (!this.hasRole(role)) {
      throw new NotRoleException(role)
    }
  }

  /**
   * 根据装饰器(@RequireRoles)鉴权, 如果验证未通过，则抛出异常: NotRoleException
   * @param requireRoles 装饰器对象
   */
  checkRoleLogical(requireRoles: RequireMetadata) {
    if (requireRoles.logical === Logical.AND) {
      this.checkRoleLogicalAnd(requireRoles.value)
    } else {
      this.checkRoleLogicalOr(requireRoles.value)
    }
  }

  /**
   * 验证用户是否含有指定角色，必须全部拥有
   * @param roles 角色标识数组
   */
  checkRoleLogicalAnd(roles: string[]) {
    for (const role of roles) {
      if (!this.hasRole(role)) {
        throw new NotRoleException(role)
      }
    }
  }

  /**
   * 验证用户是否含有指定角色，只需包含其中一个
   * @param roles 角色标识数组
   */
  checkRoleLogicalOr(roles: string[]) {
    for (const role of roles) {
      if (this.hasRole(role)) {
        return
      }
    }
    if (roles.length > 0) {
      throw new NotRoleException(roles)
    }
  }

  /**
   * 获取当前用户的权限列表
   */
  getPermissionList(): string[] {
    try {
      return this.getLoginUser().permissions
    } catch (error) {
      return []
    }
  }

  /**
   * 判断是否包含权限
   * @param permissions 权限列表
   * @param permission 权限字符串
   * @returns 用户是否具备某权限
   */
  inPermission(permissions: string[], permission: string): boolean {
    return permissions.includes(UserConstants.SUPER_ROLE_PERMISSION) || permissions.includes(permission)
  }

  /**
   * 验证用户是否具备某权限
   * @param permission 权限字符串
   * @returns 用户是否具备某权限
   */
  hasPermission(permission: string): boolean {
    return this.inPermission(this.getPermissionList(), permission)
  }

  /**
   * 验证用户是否具备某权限, 如果验证未通过，则抛出异常: NotPermissionException
   * @param permission 权限字符串
   * @returns 用户是否具备某权限
   */
  checkPermission(permission: string) {
    if (!this.hasPermission(permission)) {
      throw new NotPermissionException(permission)
    }
  }

  /**
   * 根据装饰器(@RequirePermissions)鉴权, 如果验证未通过，则抛出异常: NotPermissionException
   * @param requirePermissions 装饰器对象
   */
  checkPermissioniLogical(requirePermissions: RequireMetadata) {
    if (requirePermissions.logical === Logical.AND) {
      this.checkPermissioniLogicalAnd(requirePermissions.value)
    } else {
      this.checkPermissioniLogicalOr(requirePermissions.value)
    }
  }

  /**
   * 验证用户是否含有指定权限，必须全部拥有
   * @param permissions 权限列表
   */
  checkPermissioniLogicalAnd(permissions: string[]) {
    for (const permission of permissions) {
      if (!this.hasPermission(permission)) {
        throw new NotPermissionException(permission)
      }
    }
  }

  /**
   * 验证用户是否含有指定权限，只需包含其中一个
   * @param permissions 权限码数组
   */
  checkPermissioniLogicalOr(permissions: string[]) {
    for (const permission of permissions) {
      if (this.hasPermission(permission)) {
        return
      }
    }
    if (permissions.length > 0) {
      throw new NotPermissionException(permissions)
    }
  }
}
