import * as handlebars from 'handlebars'
import { includes, isEqual } from 'lodash'
import { GenUtils } from './gen.utils'

/**
 * 判断是否包含
 * @param value 判断值
 * @param other 判断值
 */
handlebars.registerHelper('isIn', function (value: any, other: any) {
  return includes(value, other)
})

/**
 * 判断是否不包含
 * @param value 判断值
 * @param other 判断值
 */
handlebars.registerHelper('notIn', function (value: any, other: any) {
  return !includes(value, other)
})

/**
 * 判断是否相等
 * @param value 判断值
 * @param other 判断值
 */
handlebars.registerHelper('isEqual', function (value: any, other: any) {
  return isEqual(value, other)
})

/**
 * 判断是否不相等
 * @param value 判断值
 * @param other 判断值
 */
handlebars.registerHelper('notEqual', function (value: any, other: any) {
  return !isEqual(value, other)
})

/**
 * 判断是否为是
 * @param value 判断值
 */
handlebars.registerHelper('isRequire', function (value: any) {
  return GenUtils.isRequire(value)
})

/**
 * 判断是否不为是
 * @param value 判断值
 */
handlebars.registerHelper('notRequire', function (value: any) {
  return !GenUtils.isRequire(value)
})
