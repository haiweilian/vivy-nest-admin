import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { SystemModule } from '@/modules/system/system.module'
import { LogInterceptor } from './interceptors/log.interceptor'

@Global()
@Module({
  imports: [SystemModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class CommonModule {}
