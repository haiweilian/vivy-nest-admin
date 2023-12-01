import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnums } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
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
    private configRepository: Repository<SysConfig>
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
  }

  /**
   * 更新参数配置
   * @param config 参数配置信息
   */
  async update(config: UpdateConfigDto): Promise<void> {
    await this.configRepository.update(config.configId, config)
  }

  /**
   * 删除参数配置
   * @param configIds 参数配置ID
   */
  async delete(configIds: number[]): Promise<void> {
    await this.configRepository.delete(configIds)
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
   * 参数配置详情
   * @param configKey 参数配置键名
   * @returns 参数配置键值
   */
  async getConfigValueByKey(configKey: string): Promise<string> {
    const info = await this.configRepository.findOneBy({
      configKey,
      status: BaseStatusEnums.NORMAL,
    })
    return info?.configValue
  }

  /**
   * 校验参数键名是否唯一
   * @param config 参数配置信息
   * @returns true 唯一 / false 不唯一
   */
  async checkConfigKeyUnique(config: Partial<SysConfig>): Promise<boolean> {
    const { configId, configKey } = config

    const info = await this.configRepository.findOneBy({ configKey })
    if (info && info.configId !== configId) {
      return false
    }

    return true
  }
}
