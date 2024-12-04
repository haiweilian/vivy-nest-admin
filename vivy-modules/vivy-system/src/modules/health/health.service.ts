import { Injectable } from '@nestjs/common'
import {
  DiskHealthIndicator,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'
import { RedisHealthIndicator } from './indicators/redis.health'

@Injectable()
export class HealthService {
  constructor(
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private redis: RedisHealthIndicator
  ) {}

  /**
   * 检查网络连接
   */
  async checkNetwork() {
    return this.http.pingCheck('vivy', 'http://43.140.221.180:8000/')
  }

  /**
   * 检查 MySQL 连接
   */
  async checkMysql() {
    return this.db.pingCheck('mysql')
  }

  /**
   * 检查 Redis 连接
   */
  async checkRedis() {
    return this.redis.pingCheck('redis')
  }

  /**
   * 检查磁盘使用情况
   */
  async checkDisk() {
    return this.disk.checkStorage('disk', {
      path: '/',
      thresholdPercent: 0.8,
    })
  }

  /**
   * 检查进程的内存堆使用情况
   */
  async checkMemoryHeap() {
    return this.memory.checkHeap('memory-heap', 200 * 1024 * 1024)
  }

  /**
   * 检查进程的内存使用情况 (RSS)
   */
  async checkMemoryRSS() {
    return this.memory.checkRSS('memory-rss', 200 * 1024 * 1024)
  }
}
