import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { NestGlobalContext } from './context/global'
import { NestGlobalFilters } from './exceptions-filters/global'
import { NestGlobalGuards } from './guards/global'
import { NestGlobalInterceptors } from './interceptors/global'
import { NestGlobalMiddlewares } from './middlewares/global'
import { NestGlobalPipes } from './pipes/global'

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
      providers: [
        ...NestGlobalPipes,
        ...NestGlobalGuards,
        ...NestGlobalFilters,
        ...NestGlobalContext,
        ...NestGlobalInterceptors,
      ],
      exports: [...NestGlobalContext],
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...NestGlobalMiddlewares).forRoutes('/')
  }
}
