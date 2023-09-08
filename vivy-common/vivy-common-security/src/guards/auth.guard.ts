import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NotLoginException, SecurityConstants } from '@vivy-common/core'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import { PUBLIC_METADATA } from '../security.constants'
import { TokenService } from '../services/token.service'

/**
 * 认证守卫
 * 注意：此守卫会同时验证当前用户有效期自动刷新有效期
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()

    // 网关信息附加到请求
    const userSk = request.get(SecurityConstants.USER_SK)
    if (userSk) request[SecurityConstants.USER_SK] = userSk

    const userId = request.get(SecurityConstants.USER_ID)
    if (userId) request[SecurityConstants.USER_ID] = Number(userId)

    const userName = request.get(SecurityConstants.USER_NAME)
    if (userName) request[SecurityConstants.USER_NAME] = userName

    // 如果存在 @Public 装饰器不校验
    const isPublic = this.reflector.get<boolean>(PUBLIC_METADATA, context.getHandler())
    if (isPublic) return true

    // 用户登录认证状态校验
    const token = this.tokenService.getToken(request)
    if (isEmpty(token)) {
      throw new NotLoginException('令牌不能为空')
    }

    const claims = this.tokenService.parseToken(token)
    if (isEmpty(claims)) {
      throw new NotLoginException('令牌已过期或验证不正确')
    }

    const loginUser = await this.tokenService.getLoginUser(token)
    if (isEmpty(loginUser)) {
      throw new NotLoginException('登录状态已过期')
    }

    // 用户信息附加到请求
    request[SecurityConstants.USER_SK] = loginUser.userSk
    request[SecurityConstants.USER_ID] = loginUser.userId
    request[SecurityConstants.USER_NAME] = loginUser.userName
    request[SecurityConstants.LOGIN_USER] = loginUser
    await this.tokenService.verifyTokenExpire(loginUser)

    return true
  }
}
