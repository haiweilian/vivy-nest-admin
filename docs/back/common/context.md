# 异步上下文

在 Node.js 服务开发中，把用户信息保存在请求对象上是一种常见的方式。为了不在类之间传递请求对象，所以集成了 [Async Local Storage](https://docs.nestjs.com/recipes/async-local-storage) 便于获取请求信息。

## 请求上下文

获取当前请求和响应对象。

```ts
import { Injectable } from '@nestjs/common'
import { RequestContext } from '@vivy-common/core'

@Injectable()
export class AppService {
  constructor(private requestContext: RequestContext) {}

  getHello() {
    this.requestContext.getRequest()
    this.requestContext.getResponse()
  }
}
```

## 安全上下文

获取当前已认证的用户信息。

```ts
import { Injectable } from '@nestjs/common'
import { SecurityContext } from '@vivy-common/core'

@Injectable()
export class AppService {
  constructor(private securityContext: SecurityContext) {}

  getHello() {
    this.securityContext.getUserId()
    this.securityContext.getUserName()
    this.securityContext.getLoginUser()
  }
}
```

## 相关源码

https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/context
