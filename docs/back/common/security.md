# 系统权限

在管理系统中通常需要不同的角色做不同的事情，也就有了不同的功能权限。项目实现了基于 `JWT` 的身份认证，基于 `RBAC` 的访问控制。

## 权限装饰器

使用装饰器验证当前用户是否有权限访问当前的资源。

### @Public()

公开：不需要认证就能进入该方法。

```ts
import { Public } from '@vivy-common/security'

export class AppController {
  @Public()
  getHello() {}
}
```

### @RequireRoles()

角色认证：必须具有指定角色标识才能进入该方法。

```ts
import { Logical, RequireRoles } from '@vivy-common/security'

export class AppController {
  // 必须拥有 admin 角色才可访问
  @RequireRoles('admin')
  getHello() {}

  // 必须拥有 admin 和 common 角色才可访问
  @RequireRoles(['admin', 'common'])
  getHello() {}

  // 必须拥有 admin 或 common 角色才可访问
  @RequireRoles(['admin', 'common'], Logical.OR)
  getHello() {}
}
```

### @RequirePermissions()

权限认证：必须具有指定权限才能进入该方法。

```ts
import { Logical, RequirePermissions } from '@vivy-common/security'

export class AppController {
  // 必须拥有 system:user:add 权限才可访问
  @RequirePermissions('system:user:add')
  getHello() {}

  // 必须拥有 system:user:add 和 system:user:edit 权限才可访问
  @RequirePermissions(['system:user:add', 'system:user:edit'])
  getHello() {}

  // 必须拥有 system:user:add 或 system:user:edit 权限才可访问
  @RequirePermissions(['system:user:add', 'system:user:edit'], Logical.OR)
  getHello() {}
}
```

## 编程式验证权限

如果需要在业务逻辑中验证权限可以使用 [权限验证工具类](https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-common/vivy-common-security/src/services/auth.service.ts) 提供的函数。

```ts
import { AuthService } from '@vivy-common/security'

export class AppController {
  constructor(private authService: AuthService) {}

  getHello() {
    if (this.authService.hasRole('admin')) {
      // ...
    }
    if (this.authService.hasPermission('system:user:add')) {
      // ...
    }
  }
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-security

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/app.module.ts
