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

## 相关源码

https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/decorators
