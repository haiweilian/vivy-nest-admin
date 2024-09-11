import { SetMetadata } from '@nestjs/common'
import { DATA_SCOPE_METADATA } from '../datascope.constants'
import { TableAlias } from '../datascope.interface'

/**
 * 数据权限装饰器
 * @param tableAlias 别名配置
 * @returns MethodDecorator
 */
export const DataScope = (tableAlias: TableAlias) => {
  return SetMetadata(DATA_SCOPE_METADATA, tableAlias)
}
