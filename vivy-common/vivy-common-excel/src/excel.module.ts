import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { EXCEL_OPTIONS } from './excel.constants'
import { ExcelOptions, ExcelAsyncOptions } from './excel.interface'
import { ExcelService } from './excel.service'

@Global()
@Module({})
export class ExcelModule {
  static forRoot(options?: ExcelOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: ExcelAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: ExcelAsyncOptions): DynamicModule {
    const OptionsProvider: Provider = {
      provide: EXCEL_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: ExcelModule,
      providers: [OptionsProvider, ExcelService],
      exports: [ExcelService],
    }
  }
}
