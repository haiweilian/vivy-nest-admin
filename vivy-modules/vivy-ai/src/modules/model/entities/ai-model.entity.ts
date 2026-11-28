import { BaseStatusEnum } from '@vivy-common/core'
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength } from 'class-validator'
import { Column, Entity, Index, PrimaryColumn } from 'typeorm'
import { BaseBusinessPostgresEntity } from '../../../base/entities/base-business-postgres.entity.js'
import { ModelProvider } from '../model.types.js'

/**
 * AI模型连接配置表
 */
@Entity({ name: 'ai_model' })
@Index('idx_ai_model_status_provider', ['status', 'provider'])
export class AiModel extends BaseBusinessPostgresEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    length: 36,
    comment: '模型配置ID',
  })
  @IsNotEmpty()
  id: string

  @Column({
    name: 'provider',
    type: 'varchar',
    length: 30,
    comment: '模型适配器',
  })
  @IsEnum(ModelProvider, { message: '请选择受支持的模型适配器' })
  provider: ModelProvider

  @Column({
    name: 'vendor',
    type: 'varchar',
    length: 100,
    comment: '模型来源',
  })
  @IsString()
  @IsNotEmpty({ message: '请输入模型来源' })
  @MaxLength(100)
  vendor: string

  @Column({
    name: 'model_name',
    type: 'varchar',
    length: 100,
    comment: '模型显示名称',
  })
  @IsString()
  @IsNotEmpty({ message: '请输入模型名称' })
  @Matches(/\S/, { message: '请输入模型名称' })
  @MaxLength(100)
  modelName: string

  @Column({
    name: 'model_code',
    type: 'varchar',
    length: 100,
    comment: '模型调用标识',
  })
  @IsString()
  @IsNotEmpty({ message: '请输入模型标识' })
  @MaxLength(100)
  modelCode: string

  @Column({
    name: 'base_url',
    type: 'varchar',
    length: 2048,
    comment: '模型服务地址',
  })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true, require_tld: false },
    { message: '请输入有效的HTTP接口地址' }
  )
  @MaxLength(2048)
  baseUrl: string

  /** 模型接口密钥，管理响应不回显 */
  @Column({
    name: 'secret_key',
    type: 'varchar',
    length: 256,
    select: false,
    comment: '模型接口密钥',
  })
  @IsString()
  @IsNotEmpty({ message: '请输入接口密钥' })
  @Matches(/^\S+$/, { message: '接口密钥不能包含空白字符' })
  @MaxLength(256)
  secretKey: string

  @Column({
    name: 'status',
    type: 'varchar',
    length: 1,
    default: BaseStatusEnum.DISABLE,
    comment: '状态（0启用 1停用）',
  })
  @IsEnum(BaseStatusEnum, { message: '模型状态无效' })
  @IsOptional()
  status: string
}
