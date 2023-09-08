import { Provider } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ServiceExceptionFilter } from './service.filter'
import { UnknownExceptionFilter } from './unknown.filter'

export const NestGlobalFilters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: UnknownExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ServiceExceptionFilter,
  },
]
