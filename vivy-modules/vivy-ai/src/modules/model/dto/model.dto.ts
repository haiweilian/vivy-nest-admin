import { OmitType, PartialType, PickType } from '@nestjs/mapped-types'
import { PaginateDto } from '@vivy-common/core'
import { Allow, IsEnum } from 'class-validator'
import { AiModel } from '../entities/ai-model.entity.js'
import { ModelTestMode } from '../model.types.js'
import type { ModelProvider } from '../model.types.js'

/**
 * 查询模型
 */
export class ListModelDto extends PaginateDto {
  /** 搜索模型名称、来源或调用标识 */
  @Allow()
  search?: string

  /** 模型适配器 */
  @Allow()
  provider?: ModelProvider

  /** 模型状态（0启用 1停用） */
  @Allow()
  status?: string
}

/**
 * 添加模型
 */
export class CreateModelDto extends OmitType(AiModel, ['id'] as const) {}

/**
 * 更新模型，支持部分提交
 */
export class UpdateModelDto extends PartialType(CreateModelDto) {}

/**
 * 更新模型状态
 */
export class UpdateModelStatusDto extends PickType(AiModel, ['status'] as const) {}

/**
 * 测试已保存的模型连接
 */
export class TestModelDto {
  /** 测试类型：流式文本或工具调用 */
  @IsEnum(ModelTestMode, { message: '模型测试类型无效' })
  mode: ModelTestMode = ModelTestMode.CHAT
}
