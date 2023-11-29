import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SecurityConstants, NotInnerException } from '@vivy-common/core'
import { Express } from 'express'
import { INNER_AUTH_METADATA } from '../security.constants'

/**
 * 内部认证守卫
 * 注意：内部认证是内部系统之间通过手动传递用户标识，可以跳过登录认证的一种调用方式。
 * - 如果接入网关则需要在网关转发中清除请求头中的来源标识。
 * - 如果没有接入网关则需要实现判断IP地址或者其他的判断方式。
 */
@Injectable()
export class InnerAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Express>()
    const meta = this.reflector.get<{ isUser: boolean }>(INNER_AUTH_METADATA, context.getHandler())
    if (!meta) return true

    // 内部请求验证
    const source = request.get(SecurityConstants.FROM_SOURCE)
    if (source !== SecurityConstants.SOURCE_INNER) {
      throw new NotInnerException('没有内部访问权限，不允许访问')
    }

    // 用户信息验证
    const userId = request.get(SecurityConstants.USER_ID)
    const userName = request.get(SecurityConstants.USER_NAME)
    if (meta.isUser && (!userId || !userName)) {
      throw new NotInnerException('没有设置用户信息，不允许访问')
    }

    return true
  }
}
