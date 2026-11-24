import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { OperLogModule } from '@/modules/monitor/oper-log/oper-log.module.js'
import { SysLogInterceptor } from './interceptors/log.interceptor.js'

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
