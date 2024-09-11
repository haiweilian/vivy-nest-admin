import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { DATA_SCOPE_SQL } from '../datascope.constants'

/**
 * 获取数据权限 SQL
 * @returns ParameterDecorator
 */
export const DataScopeSql = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request[DATA_SCOPE_SQL]
})
