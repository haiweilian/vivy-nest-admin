import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { ValidatorException } from '../exceptions/validator.exception'

/**
 * 参数验证管道
 * https://docs.nestjs.com/techniques/validation
 */
export const ValidationPipe = new NestValidationPipe({
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
  exceptionFactory(validationErrors) {
    const errors: string[] = (ValidationPipe as any).flattenValidationErrors(validationErrors)
    return new ValidatorException(errors[0])
  },
})
