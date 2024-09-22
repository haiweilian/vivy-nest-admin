import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigCacheService } from './config-cache.service'
import { ConfigController } from './config.controller'
import { ConfigService } from './config.service'
import { SysConfig } from './entities/sys-config.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SysConfig])],
  controllers: [ConfigController],
  providers: [ConfigService, ConfigCacheService],
  exports: [ConfigService],
})
export class ConfigModule {}
