import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { LOGGER_OPTIONS } from './logger.constants'
import { LoggerOptions, LoggerAsyncOptions } from './logger.interface'
import { NestLogger, LoggerService } from './nest.logger'
import { TypeORMLogger } from './typeorm.logger'

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options?: LoggerOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: LoggerAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: LoggerAsyncOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: LOGGER_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    const LoggerServiceProvider: Provider = {
      provide: LoggerService,
      useFactory: (options: LoggerOptions) => {
        return NestLogger(options)
      },
      inject: [LOGGER_OPTIONS],
    }

    return {
      module: LoggerModule,
      providers: [OptionsProvider, LoggerServiceProvider],
      exports: [LoggerServiceProvider],
    }
  }

  static NestLogger = NestLogger

  static TypeORMLogger = TypeORMLogger
}
