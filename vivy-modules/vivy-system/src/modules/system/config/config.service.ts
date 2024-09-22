import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ConfigCacheService } from './config-cache.service'
import { ListConfigDto, CreateConfigDto, UpdateConfigDto } from './dto/config.dto'
import { SysConfig } from './entities/sys-config.entity'

/**
 * 参数配置
 * @author vivy
 */
@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(SysConfig)
    private configRepository: Repository<SysConfig>,
    private configCacheService: ConfigCacheService
  ) {}

  /**
   * 参数配置列表
   * @param config 参数配置信息
   * @returns 参数配置列表
   */
  async list(config: ListConfigDto): Promise<Pagination<SysConfig>> {
    return paginate<SysConfig>(
      this.configRepository,
      {
        page: config.page,
        limit: config.limit,
      },
      {
        where: {
          configName: isNotEmpty(config.configName) ? Like(`%${config.configName}%`) : undefined,
          configKey: isNotEmpty(config.configKey) ? Like(`%${config.configKey}%`) : undefined,
          status: config.status,
        },
      }
    )
  }

  /**
   * 添加参数配置
   * @param config 参数配置信息
   */
  async add(config: CreateConfigDto): Promise<void> {
    await this.configRepository.insert(config)
    if (config.status === BaseStatusEnum.NORMAL) {
      await this.configCacheService.set(config.configKey)
    }
  }

  /**
   * 更新参数配置
   * @param configId 参数配置ID
   * @param config 参数配置信息
   */
  async update(configId: number, config: UpdateConfigDto): Promise<void> {
    const oldConfig = await this.configRepository.findOneBy({ configId })
    await this.configCacheService.del(oldConfig.configKey)

    await this.configRepository.update(configId, config)
    if (config.status === BaseStatusEnum.NORMAL) {
      await this.configCacheService.set(config.configKey)
    }
  }

  /**
   * 删除参数配置
   * @param configIds 参数配置ID
   */
  async delete(configIds: number[]): Promise<void> {
    for (const configId of configIds) {
      const { configKey } = await this.configRepository.findOneBy({ configId })
      await this.configRepository.delete(configId)
      await this.configCacheService.del(configKey)
    }
  }

  /**
   * 参数配置详情
   * @param configId 参数配置ID
   * @returns 参数配置详情
   */
  async info(configId: number): Promise<SysConfig> {
    return this.configRepository.findOneBy({ configId })
  }

  /**
   * 获取参数配置值
   * @param configKey 参数配置键名
   * @returns 参数配置键值
   */
  async value(configKey: string): Promise<string> {
    const config = await this.configCacheService.get(configKey)
    return config?.configValue
  }

  /**
   * 校验参数键名是否唯一
   * @param configKey 参数配置键名
   * @param configId 参数配置ID
   * @returns true 唯一 / false 不唯一
   */
  async checkConfigKeyUnique(configKey: string, configId?: number): Promise<boolean> {
    const info = await this.configRepository.findOneBy({ configKey })
    if (info && info.configId !== configId) {
      return false
    }

    return true
  }
}
