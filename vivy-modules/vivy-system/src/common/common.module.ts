import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { OperLogModule } from '@/modules/system/oper-log/oper-log.module'
import { LogInterceptor } from './interceptors/log.interceptor'

@Global()
@Module({
  imports: [OperLogModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class CommonModule {}
