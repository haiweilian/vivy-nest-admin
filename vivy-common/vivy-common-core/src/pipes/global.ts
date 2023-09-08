import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './validation.pipe'

export const NestGlobalPipes = [
  {
    provide: APP_PIPE,
    useValue: ValidationPipe,
  },
]
