import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { CacheVo } from './vo/cache.vo'

/**
 * 缓存列表
 */
export const cacheList: CacheVo[] = [
  { name: 'login_token', remark: '用户信息' },
  { name: 'captcha_code', remark: '验证码' },
  { name: 'repeat_submit', remark: '防重提交' },
  { name: 'sys_dict', remark: '数据字典' },
  { name: 'sys_config', remark: '参数配置' },
]

/**
 * 缓存管理
 * @author vivy
 */
@Injectable()
export class CacheService {
  constructor(
    @InjectRedis()
    private redis: Redis
  ) {}

  /**
   * 查询缓存名称列表
   */
  async getAll(): Promise<CacheVo[]> {
    return cacheList
  }

  /**
   * 查询缓存键名列表
   * @param name 缓存名称
   */
  async getKeys(name: string): Promise<CacheVo[]> {
    const keys = await this.redis.keys(`${name}:*`)
    return keys.map((key) => ({ name, key: key.replace(`${name}:`, '') }))
  }

  /**
   * 查询缓存内容
   * @param name 缓存名称
   * @param key 缓存键名
   */
  async getValue(name: string, key: string): Promise<CacheVo> {
    const value = await this.redis.get(`${name}:${key}`)
    return { name, key, value }
  }

  /**
   * 删除全部缓存内容
   */
  async deleteAll(): Promise<void> {
    for (const { name } of cacheList) {
      await this.deleteByName(name)
    }
  }

  /**
   * 根据缓存名称删除缓存内容
   * @param name 缓存名称
   */
  async deleteByName(name: string): Promise<void> {
    const keys = await this.redis.keys(`${name}:*`)
    await this.redis.del(keys)
  }

  /**
   * 根据缓存键名删除缓存内容
   * @param name 缓存名称
   * @param key 缓存键名
   */
  async deleteByNameAndKey(name: string, key: string): Promise<void> {
    await this.redis.del(`${name}:${key}`)
  }
}
