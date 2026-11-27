import { Module } from '@nestjs/common'
import { ModelModule } from './model/model.module.js'

/**
 * AI业务模块
 */
@Module({
  imports: [ModelModule],
  exports: [ModelModule],
})
export class AiModule {}
