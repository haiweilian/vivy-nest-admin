import { resolve } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule } from '@vivy-common/core'
import { LoggerModule, LoggerOptions, TypeORMLogger } from '@vivy-common/logger'
import { MybatisModule } from '@vivy-common/mybatis'
import { SecurityModule, SecurityOptions } from '@vivy-common/security'

import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
