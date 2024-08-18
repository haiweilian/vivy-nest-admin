import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { MYBATIS_OPTIONS } from './mybatis.constants'
import { MybatisOptions, MybatisAsyncOptions } from './mybatis.interface'
import { MybatisService } from './mybatis.service'

@Global()
@Module({})
export class MybatisModule {
  static forRoot(options?: MybatisOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: MybatisAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: MybatisAsyncOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: MYBATIS_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: MybatisModule,
      providers: [OptionsProvider, MybatisService],
      exports: [MybatisService],
    }
  }
}
