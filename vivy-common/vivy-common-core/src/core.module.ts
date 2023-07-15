import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { NestGlobalFilters } from './exceptions-filters/global'
import { NestGlobalMiddlewares } from './middlewares/global'
import { NestGlobalPipes } from './pipes/global'
import { NestGlobalServices } from './services/global'

@Global()
@Module({})
export class CoreModule implements NestModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            saveReq: true,
            saveRes: true,
            generateId: true,
          },
        }),
      ],
      providers: [...NestGlobalPipes, ...NestGlobalFilters, ...NestGlobalServices],
      exports: [...NestGlobalServices],
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...NestGlobalMiddlewares).forRoutes('/')
  }
}
