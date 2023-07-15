import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { CONFIG, CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions } from './config.interface'
import { ConfigLoader } from './config.loader'
import { ConfigService } from './config.service'
import { ConfigStore } from './config.store'

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigOptions): DynamicModule {
    return this.register(options || {})
  }

  private static register(options: ConfigOptions) {
    const OptionsProvider: Provider = {
      provide: CONFIG_OPTIONS,
      useValue: options,
    }

    const ConfigExisting: Provider = {
      provide: CONFIG,
      useExisting: ConfigService,
    }

    return {
      module: ConfigModule,
      providers: [OptionsProvider, ConfigService, ConfigExisting, ConfigStore, ConfigLoader],
      exports: [ConfigService, ConfigExisting],
    }
  }
}
