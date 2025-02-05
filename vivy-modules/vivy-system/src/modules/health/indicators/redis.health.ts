import { Injectable } from '@nestjs/common'
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @InjectRedis()
    private redis: Redis,
    private healthIndicatorService: HealthIndicatorService
  ) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key)
    try {
      const result = await this.redis.ping()
      if (result !== 'PONG') {
        throw new Error('Invalid PING response')
      }
      return indicator.up()
    } catch (error) {
      return indicator.down(error.message)
    }
  }
}
