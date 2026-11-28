import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import type { ValidationError } from '@nestjs/common'
import { ValidatorException } from '../exceptions/validator.exception.js'

/**
 * 参数验证管道
 * https://docs.nestjs.com/techniques/validation
 */
class AppValidationPipe extends NestValidationPipe {
  /**
   * 复用内置的扁平化逻辑（含嵌套对象与数组下标的路径拼装），
   * 以业务异常返回首条错误信息，避免通过 any 访问 protected 成员。
   */
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors)
      return new ValidatorException(errors[0])
    }
  }
}

// 显式标注对外类型，避免生成的声明文件引用未导出的子类
export const ValidationPipe: NestValidationPipe = new AppValidationPipe({
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
})
