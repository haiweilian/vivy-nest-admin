import { resolve } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule } from '@nestjs-modules/ioredis'
import type { RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule } from '@vivy-common/core'
import { LoggerModule, TypeORMLogger } from '@vivy-common/logger'
import type { LoggerOptions } from '@vivy-common/logger'
import { SecurityModule } from '@vivy-common/security'
import type { SecurityOptions } from '@vivy-common/security'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { ModelModule } from './modules/model/model.module.js'

@Module({
  imports: [
    // plugin
    ConfigModule.forRoot({
      cwd: resolve(import.meta.dirname, 'config'),
    }),
    RedisModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: 'single',
          options: config.get<RedisModuleOptions['options']>('redis.defalut'),
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          ...config.get<TypeOrmModuleOptions>('datasource.defalut'),
          logger: new TypeORMLogger(config.get<LoggerOptions>('logger')),
          // typeorm 1.x 默认对 where 中的 undefined 抛错，这里保持 0.3 的「跳过」语义
          invalidWhereValuesBehavior: { undefined: 'ignore' },
        }
      },
      inject: [ConfigService],
    }),

    // common
    CoreModule.forRoot(),
    LoggerModule.forRootAsync({
      useFactory(config: ConfigService) {
        return config.get<LoggerOptions>('logger')
      },
      inject: [ConfigService],
    }),
    SecurityModule.forRootAsync({
      useFactory(config: ConfigService) {
        return config.get<SecurityOptions>('security')
      },
      inject: [ConfigService],
    }),

    // modules
    ModelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
