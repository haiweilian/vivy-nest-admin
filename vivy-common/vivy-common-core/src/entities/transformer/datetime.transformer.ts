import { ValueTransformer } from 'typeorm'
import { DateUtils } from '../../utils'

/**
 * 转换日期时间格式的值
 */
export const DateTimeTransformer: ValueTransformer = {
  to(value) {
    return value
  },

  from(value) {
    if (!value) return value
    return DateUtils.formatDateTime(new Date(value))
  },
}
