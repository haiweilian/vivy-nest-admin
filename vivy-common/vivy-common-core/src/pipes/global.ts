import { Provider } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './validation.pipe.js'

export const NestGlobalPipes: Provider[] = [
  {
    provide: APP_PIPE,
    useValue: ValidationPipe,
  },
]
