import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions, ConfigAsyncOptions } from './config.interface'
import { ConfigLoader } from './config.loader'
import { ConfigService } from './config.service'
import { ConfigStore } from './config.store'

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: ConfigAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: ConfigAsyncOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: CONFIG_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: ConfigModule,
      providers: [OptionsProvider, ConfigService, ConfigStore, ConfigLoader],
      exports: [ConfigService],
    }
  }
}
