import * as path from 'path'
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { ConfigModule, ConfigService } from '@vivy-common/config'
import { CoreModule } from '@vivy-common/core'
import { LoggerModule, TypeORMLogger } from '@vivy-common/logger'
import { SecurityModule } from '@vivy-common/security'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommonModule } from './common/common.module'
import { AuthModule } from './modules/auth/auth.module'
import { GenModule } from './modules/gen/gen.module'
import { SystemModule } from './modules/system/system.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      dir: path.resolve(__dirname, 'config'),
    }),
    CoreModule.forRoot(),
    SecurityModule.forRoot(),
    LoggerModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          appName: config.get('app.name'),
          logPath: path.resolve(__dirname, '../logs'),
        }
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          config: config.get<RedisModuleOptions['config']>('redis.defalut'),
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
            logPath: path.resolve(__dirname, '../logs'),
          }),
        }
      },
      inject: [ConfigService],
    }),

    CommonModule,
    AuthModule,
    GenModule,
    SystemModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'system',
        module: SystemModule,
      },
      {
        path: 'gen',
        module: GenModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
