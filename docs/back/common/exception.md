# 异常处理

在开发中有大量需要处理的异常。比如业务异常、权限异常、代码异常等等。对于有些异常错误我们需要捕获异常并返回客户端提示信息。我们不希望在业务中重复的处理，所以我们使用 [异常过滤器](https://docs.nestjs.com/exception-filters) 拦截统一处理。

## 统一实体

异常的实体结构与响应成功的一致。

```ts
class AjaxResult {
  /** 状态码 */
  code: number

  /** 响应数据 */
  data?: T

  /** 响应消息 */
  message?: string
}
```

## 内置异常

业务中通常需要定义自己的异常类，便于区分单独处理。

- `ServiceException` 业务逻辑异常(业务基础异常类)
- `ValidatorException` 未能通过的验证异常
- `NotRoleException` 未能通过的角色认证异常
- `NotPermissionException` 未能通过的权限认证异常
- `NotLoginException` 未能通过的登录认证异常
- `NotInnerException` 未能通过的内部认证异常

```ts
import { Injectable } from '@nestjs/common'
import { ServiceException } from '@vivy-common/core'

@Injectable()
export class LoginService {
  async login(form: LoginDto): Promise<SysLoginUser> {
    const { username, password } = form
    if (isEmpty(username) || isEmpty(password)) {
      throw new ServiceException('用户/密码必须填写')
    }
  }
}
```

## 异常过滤器

为了能返回统一结构需要使用全局异常过滤器。如果需要也可以对某个异常做单独处理。

- 业务异常过滤器，自定义的业务异常。

```ts
// vivy-common/vivy-common-core/src/exceptions-filters/service.filter.ts
@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  // ...

  /**
   * 默认异常
   */
  private DefaultException(exception: NotRoleException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: exception.getMessage() })
    return AjaxResult.error(exception.getMessage(), exception.getCode())
  }

  /**
   * 未能通过的角色认证异常
   */
  private NotRoleException(exception: NotRoleException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: `角色权限校验失败：${exception.getMessage()}` })
    return AjaxResult.error('没有访问权限，请联系管理员授权', exception.getCode())
  }
}
```

- 未知异常过滤器，所有未经过处理的异常将会返回 `服务异常，请稍后重试` 消息。

```ts
// vivy-common/vivy-common-core/src/exceptions-filters/unknown.filter.ts
@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  // ...

  /**
   * 默认异常
   */
  private DefaultException(exception: Error, request: Request): AjaxResult {
    const response = exception instanceof HttpException ? exception.getResponse() : undefined
    this.logger.error({ message: exception.message, response }, exception.stack)
    return AjaxResult.error('服务异常，请稍后重试', HttpStatus.INTERNAL_SERVER_ERROR)
  }

  /**
   * 资源不存在异常
   */
  private NotFoundException(exception: NotFoundException, request: Request): AjaxResult {
    this.logger.error({ url: request.url, message: exception.message })
    return AjaxResult.error('请求资源不存在，请稍后重试', exception.getStatus())
  }
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/exceptions

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/exceptions-filters
