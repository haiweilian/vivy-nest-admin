import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { OperLogModule } from '@/modules/monitor/oper-log/oper-log.module'
import { SysLogInterceptor } from './interceptors/log.interceptor'

@Global()
@Module({
  imports: [OperLogModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SysLogInterceptor,
    },
  ],
})
export class BaseModule {}
