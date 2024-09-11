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

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './common/common.module'
import { AuthModule } from './modules/auth/auth.module'
import { FileModule } from './modules/file/file.module'
import { GenModule } from './modules/gen/gen.module'
import { MonitorModule } from './modules/monitor/monitor.module'
import { SystemModule } from './modules/system/system.module'

@Module({
  imports: [
    // plugin
    ConfigModule.forRoot({
      cwd: resolve(__dirname, 'config'),
    }),
    MybatisModule.forRoot({
      cwd: __dirname,
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
    CommonModule,
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
    SystemModule,
    MonitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
