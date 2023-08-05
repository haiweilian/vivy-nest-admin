import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { SysLoginUser } from '../class/sys-login-user'
import { SecurityConstants } from '../constants/security.constants'

/**
 * 用户信息 User 参数装饰器
 */
export const User = createParamDecorator<keyof SysLoginUser>((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const user = request[SecurityConstants.LOGIN_USER]
  return data ? user && user[data] : user
})

/**
 * 用户信息 UserId 参数装饰器
 */
export const UserId = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const userId = request[SecurityConstants.USER_ID]
  return userId
})

/**
 * 用户信息 UserName 参数装饰器
 */
export const UserName = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  const userName = request[SecurityConstants.USER_NAME]
  return userName
})
