# 参数校验

参数验证可以避免一些因为数据发生的异常，并且也能把错误信息友好的反馈给客户端。项目已集成 [内置验证](https://docs.nestjs.com/techniques/validation) 当验证失败时统一抛出 `ValidatorException` 异常，方便异常过滤器统一处理。

```ts
import { ValidationPipe as NestValidationPipe } from '@nestjs/common'
import { ValidatorException } from '../exceptions/validator.exception'

export const ValidationPipe = new NestValidationPipe({
  transform: true,
  whitelist: true,
  stopAtFirstError: true,
  exceptionFactory(validationErrors) {
    const errors: string[] = (ValidationPipe as any).flattenValidationErrors(validationErrors)
    return new ValidatorException(errors[0])
  },
})
```

## 基础使用

```ts
import { IsNotEmpty, MaxLength } from 'class-validator'

class SysUser {
  @MaxLength(50, { message: '用户名称不能大于50个字符' })
  @IsNotEmpty({ message: '用户名称不能为空' })
  userName: string

  @MaxLength(50, { message: '用户昵称不能大于50个字符' })
  @IsNotEmpty({ message: '用户昵称不能为空' })
  nickName: string
}
```

## 自定义验证

基于 [class-validator](https://github.com/typestack/class-validator#validation-decorators) 扩展的验证装饰器。

### @NotMatches()

与 `Matches` 相反，检查字符串与正则不匹配。

```ts
import { NotMatches } from '@vivy-common/core'

class SysTest {
  @NotMatches(/[,-]/, { each: true, message: '标签名称不能包含 ,- 字符' })
  tags: string[]
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/validator

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-common/vivy-common-core/src/pipes/validation.pipe.ts
