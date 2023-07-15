import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { SecurityConstants } from '../constants/security.constants'
import { SysLoginUser } from '../models/sys-login-user.model'

/**
 * 用户信息参数装饰器
 */
export const User = createParamDecorator<keyof SysLoginUser>((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const user = request[SecurityConstants.LOGIN_USER]
  return data ? user && user[data] : user
})
