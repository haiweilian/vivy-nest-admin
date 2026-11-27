import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AiModel } from './entities/ai-model.entity.js'
import { ModelConnectionService } from './model-connection.service.js'
import { ModelController } from './model.controller.js'
import { ModelService } from './model.service.js'

/**
 * AI模型管理模块
 */
@Module({
  imports: [TypeOrmModule.forFeature([AiModel])],
  controllers: [ModelController],
  providers: [ModelService, ModelConnectionService],
  exports: [ModelService],
})
export class ModelModule {}
