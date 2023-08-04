import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { MYBATIS_OPTIONS } from './mybatis.constants'
import { MybatisOptions } from './mybatis.interface'
import { MybatisService } from './mybatis.service'

@Global()
@Module({})
export class MybatisModule {
  static forRoot(options?: MybatisOptions): DynamicModule {
    return this.register(options || {})
  }

  private static register(options: MybatisOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: MYBATIS_OPTIONS,
      useValue: options,
    }

    return {
      module: MybatisModule,
      providers: [OptionsProvider, MybatisService],
      exports: [MybatisService],
    }
  }
}
