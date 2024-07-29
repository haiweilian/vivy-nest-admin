import { resolve } from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule, TokenConstants } from '@vivy-common/core'
import { LoggerModule, TypeORMLogger } from '@vivy-common/logger'
import { MybatisModule } from '@vivy-common/mybatis'
import { SecurityModule } from '@vivy-common/security'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    // plugin
    ConfigModule.forRoot({
      dir: resolve(__dirname, 'config'),
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
          logger: new TypeORMLogger({
            appName: config.get('app.name'),
            logPath: resolve(__dirname, '../logs'),
          }),
        }
      },
      inject: [ConfigService],
    }),

    // common
    CoreModule.forRoot(),
    LoggerModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          appName: config.get('app.name'),
          logPath: resolve(__dirname, '../logs'),
        }
      },
      inject: [ConfigService],
    }),
    SecurityModule.forRootAsync({
      useFactory() {
        return {
          secret: TokenConstants.SECRET,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
