import { ValueTransformer } from 'typeorm'
import { DateUtils } from '../../utils'

/**
 * 转换日期格式的值
 */
export const DateTransformer: ValueTransformer = {
  to(value) {
    return value
  },

  from(value) {
    if (!value) return value
    return DateUtils.formatDate(new Date(value))
  },
}
