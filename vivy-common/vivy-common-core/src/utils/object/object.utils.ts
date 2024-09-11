import { omitBy, isNil, isNull, isUndefined } from 'lodash'

/**
 * 对象工具方法
 */
export class ObjectUtils {
  /**
   * 排除 Null | Undefined 值
   */
  static omitNil<T extends object>(obj: T) {
    return omitBy(obj, isNil)
  }

  /**
   * 排除 Null 值
   */
  static omitNull<T extends object>(obj: T) {
    return omitBy(obj, isNull)
  }

  /**
   * 排除 Undefined 值
   */
  static omitUndefined<T extends object>(obj: T) {
    return omitBy(obj, isUndefined)
  }
}
