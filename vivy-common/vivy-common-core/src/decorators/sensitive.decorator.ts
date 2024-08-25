import { Transform } from 'class-transformer'

/**
 * 数据脱敏
 * @param fn 脱敏函数
 * @returns PropertyDecorator
 */
export const Sensitive = (fn: (value: any) => any) => {
  return Transform(({ value }) => fn(value), { toPlainOnly: true })
}
