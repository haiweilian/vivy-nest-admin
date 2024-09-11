import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { DATA_SCOPE_OPTIONS } from './datascope.constants'
import { DataScopeInterceptor } from './datascope.interceptor'
import { DataScopeOptions, DataScopeAsyncOptions } from './datascope.interface'
import { DataScopeService } from './datascope.service'

@Global()
@Module({})
export class DataScopeModule {
  static forRoot(options?: DataScopeOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: DataScopeAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: DataScopeAsyncOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: DATA_SCOPE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: DataScopeModule,
      providers: [
        OptionsProvider,
        DataScopeService,
        {
          provide: APP_INTERCEPTOR,
          useClass: DataScopeInterceptor,
        },
      ],
      exports: [DataScopeService],
    }
  }
}
