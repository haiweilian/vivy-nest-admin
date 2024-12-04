import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @InjectRedis()
    private redis: Redis
  ) {
    super()
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const result = await this.redis.ping()
      if (result !== 'PONG') {
        throw new Error('Invalid PING response')
      }
      return this.getStatus(key, true)
    } catch (error) {
      throw new HealthCheckError('Redis check failed', this.getStatus(key, false, { error: error.message }))
    }
  }
}
