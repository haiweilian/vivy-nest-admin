import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG_OPTIONS } from './config.constants.js'
import { ConfigOptions, ConfigAsyncOptions } from './config.interface.js'
import { ConfigLoader } from './config.loader.js'
import { ConfigService } from './config.service.js'
import { ConfigStore } from './config.store.js'

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
