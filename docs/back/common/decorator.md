# 装饰器

## 用户信息

### @User()

获取当前登录的用户信息。

```ts
import { User, type SysLoginUser, type SysUser } from '@vivy-common/core'

export class AppController {
  getHello(@User() loginUser: SysLoginUser, @User('sysUser') userInfo: SysUser) {}
}
```

### @UserId()

获取当前登录的用户标识。

```ts
import { UserId } from '@vivy-common/core'

export class AppController {
  getHello(@UserId() userId: number) {}
}
```

### @UserName()

获取当前登录的用户名称。

```ts
import { UserName } from '@vivy-common/core'

export class AppController {
  getHello(@UserName() userName: string) {}
}
```

## 防重复提交

在接口方法上添加 `@RepeatSubmit` 装饰器即可。**依赖 Redis 服务**

### @RepeatSubmit()

```ts
import { RepeatSubmit } from '@vivy-common/core'

export class UserController {
  @Post('add')
  @RepeatSubmit()
  async add() {}

  @Post('update')
  @RepeatSubmit({ interval: 10, message: '请求频繁10秒后重试' })
  async update() {}
}
```

装饰器参数配置。

```ts
class RepeatSubmitOptions {
  /**
   * 间隔时间
   * @default 5s
   */
  interval?: number = 5

  /**
   * 错误消息
   * @default
   */
  message?: string = '请求过于频繁'
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/decorators
