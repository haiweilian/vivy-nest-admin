import { format } from 'date-fns'

/**
 * 时间工具方法
 */
export class DateUtils {
  static DATE_FORMAT = 'yyyy-MM-dd'

  static DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'

  /**
   * 格式化日期
   * @param date 原始时间
   * @default new Date()
   * @returns 返回 yyyy-MM-dd 格式的日期
   */
  static formatDate(date?: Date | number): string {
    return format(date || new Date(), DateUtils.DATE_FORMAT)
  }

  /**
   * 格式化日期时间
   * @param date 原始时间
   * @default Date 当前时间
   * @returns 返回 yyyy-MM-dd HH:mm:ss 格式的日期时间
   */
  static formatDateTime(date?: Date | number): string {
    return format(date || new Date(), DateUtils.DATETIME_FORMAT)
  }
}
