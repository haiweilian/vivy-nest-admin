import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Request } from 'express'
import { CacheConstants } from '../constants/cache.constants'
import { RepeatSubmitOptions, REPEAT_SUBMIT_METADATA } from '../decorators/repeat-submit.decorator'
import { ServiceException } from '../exceptions/service.exception'

/**
 * 防止重复提交守卫
 */
@Injectable()
export class RepeatSubmitGuard implements CanActivate {
  constructor(
    @InjectRedis()
    public redis: Redis,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const meta = this.reflector.get<RepeatSubmitOptions>(REPEAT_SUBMIT_METADATA, context.getHandler())
    if (!meta) return true

    const request: Request = context.switchToHttp().getRequest()
    const key = `${CacheConstants.REPEAT_SUBMIT_KEY}${request.url}`
    const data = JSON.stringify({ body: request.body, prams: request.params, query: request.query })

    const cache = await this.redis.get(key)
    if (!cache) {
      await this.redis.set(key, data, 'EX', meta.interval)
    } else {
      if (data === cache) {
        throw new ServiceException(meta.message)
      }
    }

    return true
  }
}
