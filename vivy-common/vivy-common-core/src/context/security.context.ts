import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { SysLoginUser } from '../class/sys-login-user'
import { SecurityConstants } from '../constants/security.constants'
import { TokenConstants } from '../constants/token.constants'
import { RequestContext } from './request.context'

/**
 * 安全上下文
 *
 * 注意：必须提前添加到请求对象中，否则这里无法获取。
 *  - 在 vivy-gateway(AuthFilter)中通过设置请求头的方法传入。
 *  - 在 vivy-common-security(AuthGuard)中通过添加到请求对象中的方法传入。
 */
@Injectable()
export class SecurityContext {
  constructor(private requestContext: RequestContext) {}

  /**
   * 获取 request
   */
  getRequest(req?: Request): Request {
    return req || this.requestContext.getRequest()
  }

  /**
   * 获取用户会话key
   */
  getUserSk(req?: Request): string {
    return this.getRequest(req)[SecurityConstants.USER_SK]
  }

  /**
   * 获取用户ID
   */
  getUserId(req?: Request): number {
    return this.getRequest(req)[SecurityConstants.USER_ID]
  }

  /**
   * 获取用户名称
   */
  getUserName(req?: Request): string {
    return this.getRequest(req)[SecurityConstants.USER_NAME]
  }

  /**
   * 获取登录用户信息
   */
  getLoginUser(req?: Request): SysLoginUser {
    return this.getRequest(req)[SecurityConstants.LOGIN_USER]
  }

  /**
   * 获取请求token
   */
  getToken(req?: Request): string {
    const token = this.getRequest(req).get(TokenConstants.AUTHENTICATION)
    return this.replaceTokenPrefix(token)
  }

  /**
   * 如果前端设置了令牌前缀，则裁剪掉前缀
   */
  private replaceTokenPrefix(token: string): string {
    if (token && token.startsWith(TokenConstants.PREFIX)) {
      return token.replace(TokenConstants.PREFIX, '')
    } else {
      return token
    }
  }
}
