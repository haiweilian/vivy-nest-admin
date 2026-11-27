import { resolve } from 'path'
import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule } from '@vivy-common/core'
import { DataScopeModule } from '@vivy-common/datascope'
import { ExcelModule } from '@vivy-common/excel'
import { LoggerModule, TypeORMLogger, LoggerOptions } from '@vivy-common/logger'
import { MybatisModule } from '@vivy-common/mybatis'
import { SecurityModule, SecurityOptions } from '@vivy-common/security'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { BaseModule } from './base/base.module.js'
import { AiModule } from './modules/ai/ai.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { FileModule } from './modules/file/file.module.js'
import { GenModule } from './modules/gen/gen.module.js'
import { HealthModule } from './modules/health/health.module.js'
import { MonitorModule } from './modules/monitor/monitor.module.js'
import { SystemModule } from './modules/system/system.module.js'

@Module({
  imports: [
    // plugin
    ConfigModule.forRoot({
      cwd: resolve(import.meta.dirname, 'config'),
    }),
    MybatisModule.forRoot({
      cwd: import.meta.dirname,
      globs: ['**/*.mapper.xml'],
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
    BullModule.forRootAsync({
      useFactory(config: ConfigService) {
        return config.get<BullModuleOptions>('bull')
      },
      inject: [ConfigService],
    }),

    // common
    BaseModule,
    CoreModule.forRoot(),
    ExcelModule.forRoot(),
    DataScopeModule.forRoot(),
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
    GenModule,
    FileModule,
    AuthModule,
    HealthModule,
    SystemModule,
    MonitorModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
