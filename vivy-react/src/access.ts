import { isArray, intersection } from 'lodash-es'

/**
 * 初始化状态
 */
interface InitialState {
  roles?: string[]
  permissions?: string[]
}

/**
 * 权限验证模式
 */
export enum Logical {
  /**
   * 必须具有所有的元素
   */
  AND,

  /**
   * 只需具有其中一个元素
   */
  OR,
}

/**
 * 超级管理员权限标识
 */
const SUPER_ROLE_CODE = 'admin'
const SUPER_ROLE_PERMISSION = '*:*:*'

/**
 * @name Access 在这里按照初始化数据定义项目中的权限，统一管理
 * @doc https://umijs.org/docs/max/access
 */
export default ({ roles = [], permissions = [] }: InitialState = {}) => {
  /**
   * 校验是否包含角色
   * @param value 需要校验的角色标识
   * @param logical 验证逻辑：AND | OR，默认AND
   * @returns true / false
   */
  const hasRole = (value: AccessRole | AccessRole[], logical: Logical = Logical.AND) => {
    if (roles.includes(SUPER_ROLE_CODE)) {
      return true
    }

    if (!isArray(value)) {
      return roles.includes(value)
    } else if (logical === Logical.AND) {
      return intersection(roles, value).length === value.length
    } else {
      return intersection(roles, value).length > 0
    }
  }

  /**
   * 校验是否包含权限吗
   * @param value 需要校验的权限码
   * @param logical 验证逻辑：AND | OR，默认AND
   * @returns true / false
   */
  const hasPermission = (value: AccessPermission | AccessPermission[], logical: Logical = Logical.AND) => {
    if (permissions.includes(SUPER_ROLE_PERMISSION)) {
      return true
    }

    if (!isArray(value)) {
      return permissions.includes(value)
    } else if (logical === Logical.AND) {
      return intersection(permissions, value).length === value.length
    } else {
      return intersection(permissions, value).length > 0
    }
  }

  return {
    hasRole,
    hasPermission,
  }
}
