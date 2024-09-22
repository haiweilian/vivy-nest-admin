import { Module } from '@nestjs/common'

import { CacheController } from './cache.controller'
import { CacheService } from './cache.service'

@Module({
  imports: [],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
