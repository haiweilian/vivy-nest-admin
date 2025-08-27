import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { BaseStatusEnum } from '@vivy-common/core'
import { Redis } from 'ioredis'
import { Repository } from 'typeorm'
import { SYS_CONFIG_KEY } from '@/base/constants/cache.constants'
import { SysConfig } from './entities/sys-config.entity'

/**
 * 参数配置缓存
 * @author vivy
 */
@Injectable()
export class ConfigCacheService implements OnModuleInit {
  constructor(
    @InjectRedis()
    private redis: Redis,

    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>
  ) {}

  async onModuleInit() {
    this.init()
  }

  /**
   * 加载参数配置缓存
   */
  async init(): Promise<void> {
    const configs = await this.configRepository.findBy({ status: BaseStatusEnum.NORMAL })
    for (const config of configs) {
      await this.redis.set(this.getCacheKey(config.configKey), JSON.stringify(config))
    }
  }

  /**
   * 重置参数配置缓存
   */
  async reset(): Promise<void> {
    await this.clear()
    await this.init()
  }

  /**
   * 设置参数配置缓存
   * @param configKey 缓存 key
   */
  async set(configKey: string): Promise<void> {
    const config = await this.configRepository.findOneBy({ configKey })
    await this.redis.set(this.getCacheKey(configKey), JSON.stringify(config))
  }

  /**
   * 查询参数配置缓存
   * @param configKey 缓存 key
   * @returns 缓存值
   */
  async get(configKey: string): Promise<SysConfig> {
    const config = await this.redis.get(this.getCacheKey(configKey))
    return JSON.parse(config)
  }

  /**
   * 删除参数配置缓存
   * @param configKey 缓存 key
   */
  async del(configKey: string): Promise<void> {
    await this.redis.del(this.getCacheKey(configKey))
  }

  /**
   * 清空参数配置缓存
   */
  async clear(): Promise<void> {
    const keys = await this.redis.keys(this.getCacheKey('*'))
    await this.redis.del(keys)
  }

  /**
   * 获取缓存 key
   */
  private getCacheKey(configKey: string): string {
    return `${SYS_CONFIG_KEY}${configKey}`
  }
}
