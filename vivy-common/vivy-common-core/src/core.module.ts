import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { NestGlobalContext } from './context/global.js'
import { NestGlobalFilters } from './exceptions-filters/global.js'
import { NestGlobalGuards } from './guards/global.js'
import { NestGlobalInterceptors } from './interceptors/global.js'
import { NestGlobalMiddlewares } from './middlewares/global.js'
import { NestGlobalPipes } from './pipes/global.js'

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
