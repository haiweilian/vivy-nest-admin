import { Module } from '@nestjs/common'

import { CacheController } from './cache.controller.js'
import { CacheService } from './cache.service.js'

@Module({
  imports: [],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
