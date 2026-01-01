import { Provider } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { HttpStatusInterceptor } from './http-status.interceptor'

export const NestGlobalInterceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: HttpStatusInterceptor,
  },
]
