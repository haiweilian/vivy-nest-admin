import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigCacheService } from './config-cache.service.js'
import { ConfigController } from './config.controller.js'
import { ConfigService } from './config.service.js'
import { SysConfig } from './entities/sys-config.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysConfig])],
  controllers: [ConfigController],
  providers: [ConfigService, ConfigCacheService],
  exports: [ConfigService],
})
export class ConfigModule {}
