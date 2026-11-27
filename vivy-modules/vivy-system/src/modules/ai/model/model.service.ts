import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnum, ServiceException } from '@vivy-common/core'
import { nanoid } from 'nanoid'
import { paginate } from 'nestjs-typeorm-paginate'
import type { Pagination } from 'nestjs-typeorm-paginate'
import { Brackets, Repository } from 'typeorm'
import type { CreateModelDto, ListModelDto, UpdateModelDto } from './dto/model.dto.js'
import { AiModel } from './entities/ai-model.entity.js'
import { ModelConnectionService } from './model-connection.service.js'
import type { ModelTestMode, ModelTestResult, ModelView } from './model.types.js'

/**
 * 提取管理端允许展示的模型字段
 * @param model 模型实体
 * @returns 不含接口密钥的模型配置
 */
function modelView(model: AiModel): ModelView {
  return {
    id: model.id,
    provider: model.provider,
    vendor: model.vendor,
    modelName: model.modelName,
    modelCode: model.modelCode,
    baseUrl: model.baseUrl,
    status: model.status,
    hasCredential: Boolean(model.secretKey),
    createBy: model.createBy,
    createTime: model.createTime,
    updateBy: model.updateBy,
    updateTime: model.updateTime,
  }
}

/**
 * AI模型管理
 */
@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(AiModel)
    private modelRepository: Repository<AiModel>,
    private modelConnectionService: ModelConnectionService
  ) {}

  /**
   * 模型列表
   * @param query 查询条件
   * @returns 脱敏的模型分页
   */
  async list(query: ListModelDto): Promise<Pagination<ModelView>> {
    const builder = this.modelRepository
      .createQueryBuilder('model')
      .addSelect('model.secretKey')
      .orderBy('model.createTime', 'DESC')
      .addOrderBy('model.id', 'ASC')
    if (query.provider) builder.andWhere('model.provider = :provider', { provider: query.provider })
    if (query.status) builder.andWhere('model.status = :status', { status: query.status })
    if (query.search) {
      builder.andWhere(
        new Brackets((where) => {
          where
            .where('model.vendor LIKE :search', { search: '%' + query.search + '%' })
            .orWhere('model.modelName LIKE :search')
            .orWhere('model.modelCode LIKE :search')
        })
      )
    }
    const page = await paginate(builder, { page: query.page, limit: query.limit })
    return { ...page, items: page.items.map(modelView) }
  }

  /**
   * 模型详情
   * @param id 模型ID
   * @returns 脱敏的模型配置
   */
  async info(id: string): Promise<ModelView> {
    return modelView(await this.find(id))
  }

  /**
   * 添加模型连接配置
   * @param data 模型连接配置
   * @returns 新增模型ID
   */
  async add(data: CreateModelDto): Promise<{ id: string }> {
    const id = nanoid()
    await this.modelRepository.insert({
      id,
      provider: data.provider,
      vendor: data.vendor,
      modelName: data.modelName,
      modelCode: data.modelCode,
      baseUrl: this.baseUrl(data.baseUrl),
      status: data.status ?? BaseStatusEnum.DISABLE,
      secretKey: data.secretKey,
      createBy: data.createBy,
    })
    return { id }
  }

  /**
   * 更新模型，只写入本次提供的字段
   * @param id 模型ID
   * @param data 需要更新的字段，未提供或为null时沿用已有配置
   */
  async update(id: string, data: UpdateModelDto): Promise<void> {
    const result = await this.modelRepository.update(id, {
      provider: data.provider ?? undefined,
      vendor: data.vendor ?? undefined,
      modelName: data.modelName ?? undefined,
      modelCode: data.modelCode ?? undefined,
      baseUrl: data.baseUrl == null ? undefined : this.baseUrl(data.baseUrl),
      secretKey: data.secretKey ?? undefined,
      status: data.status ?? undefined,
      updateBy: data.updateBy,
    })
    if (!result.affected) throw new ServiceException('模型配置不存在')
  }

  /**
   * 删除模型配置
   * @param id 模型ID
   */
  async delete(id: string): Promise<void> {
    const result = await this.modelRepository.delete(id)
    if (!result.affected) throw new ServiceException('模型配置不存在')
  }

  /**
   * 测试已保存的模型连接，允许测试停用模型
   * @param id 模型ID
   * @param mode 流式文本或工具调用
   * @returns 脱敏的连接测试结果
   */
  async test(id: string, mode: ModelTestMode): Promise<ModelTestResult> {
    return this.modelConnectionService.test(await this.find(id), mode)
  }

  /**
   * 读取模型连接信息，包含密钥，供服务端调用方使用
   * @param id 模型ID
   * @returns 模型实体，不存在时抛出业务异常
   */
  async find(id: string): Promise<AiModel> {
    const model = await this.modelRepository
      .createQueryBuilder('model')
      .addSelect('model.secretKey')
      .where('model.id = :id', { id })
      .getOne()
    if (!model) throw new ServiceException('模型配置不存在')
    return model
  }

  /**
   * 校验并规范化连接地址
   * @param value 基础接口地址
   * @returns 移除末尾斜杠的HTTP地址
   */
  private baseUrl(value: string): string {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new ServiceException('接口地址只允许HTTP地址和路径，不能包含凭据、查询参数或片段')
    }
    return url.toString().replace(/\/$/, '')
  }
}
