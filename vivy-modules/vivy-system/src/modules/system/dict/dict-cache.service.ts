import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { groupBy } from 'lodash'
import { Repository } from 'typeorm'
import { SYS_DICT_KEY } from '@/common/constants/cache.constants'
import { SysDictData } from './entities/sys-dict-data.entity'

/**
 * 字典数据缓存
 * @author vivy
 */
@Injectable()
export class DictCacheService implements OnModuleInit {
  constructor(
    @InjectRedis()
    private redis: Redis,

    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>
  ) {}

  async onModuleInit() {
    this.init()
  }

  /**
   * 加载参数配置缓存
   */
  async init(): Promise<void> {
    const datas = await this.dictDataRepository.find({ order: { dictSort: 'ASC' } })
    const group = groupBy(datas, 'dictType')
    for (const type in group) {
      const data = group[type]
      await this.redis.set(this.getCacheKey(type), JSON.stringify(data))
    }
  }

  /**
   * 清空参数配置缓存
   */
  async clear(): Promise<void> {
    await this.redis.del(`${SYS_DICT_KEY}*`)
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
   * @param dictType 缓存 key
   */
  async set(dictType: string): Promise<void> {
    const data = await this.dictDataRepository.findBy({ dictType })
    await this.redis.set(this.getCacheKey(dictType), JSON.stringify(data))
  }

  /**
   * 查询参数配置缓存
   * @param dictType 缓存 key
   * @returns 缓存值
   */
  async get(dictType: string): Promise<SysDictData[]> {
    const data = await this.redis.get(this.getCacheKey(dictType))
    return JSON.parse(data)
  }

  /**
   * 删除参数配置缓存
   * @param dictType 缓存 key
   */
  async del(dictType: string): Promise<void> {
    await this.redis.del(this.getCacheKey(dictType))
  }

  /**
   * 获取缓存 key
   */
  private getCacheKey(dictType: string): string {
    return `${SYS_DICT_KEY}${dictType}`
  }
}
