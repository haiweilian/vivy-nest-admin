import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'

/**
 * 参数验证管道
 * https://docs.nestjs.com/techniques/validation
 */
export const ValidationPipe = {
  provide: APP_PIPE,
  useValue: new NestValidationPipe({
    transform: true,
    whitelist: true,
  }),
}
