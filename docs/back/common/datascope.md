# 数据权限

在实际开发中，需要设置用户只能查看哪些部门的数据，这种情况一般称为数据权限。

::: tip
超级管理员管理员 admin 拥有所有数据权限（userId=1）

默认角色拥有所有数据权限（如不需要数据权限不用设置数据权限操作）

:::

## 数据权限设置

在（系统管理-角色管理）设置需要数据权限的角色 目前支持以下几种权限：

- 全部数据权限
- 自定数据权限
- 部门数据权限
- 部门及以下数据权限
- 仅本人数据权限

## 数据权限实现

实现数据权限实际就是在数据查询的 `sql` 语句中添加 `where` 条件，例如：

用户管理（未过滤数据权限的情况）

```sql
select u.*
from sys_user u
	left join sys_dept d on u.dept_id = d.dept_id
```

用户管理（过滤数据权限的情况）

```sql{5}
select u.*
from sys_user u
	left join sys_dept d on u.dept_id = d.dept_id
-- 查询本部门的数据
where u.dept_id = 105
```

```sql{5-7}
select u.*
from sys_user u
	left join sys_dept d on u.dept_id = d.dept_id
 -- 查询本部门及以下数据权限
where u.dept_id in(
	select dept_id from sys_dept where dept_id = 100 or FIND_IN_SET(100, ancestors)
)
```

所以只需根据**当前登录的用户**和**分配的数据权限类型**，动态生成不同的数据范围 `sql` 语句，然后拼接到查询 `sql` 中即可实现数据过滤。

## 数据权限使用

在需要数据权限的方法上添加 `@DataScope` 装饰器。

- deptAlias：部门表别名
- userAlias：用户表别名

::: tip
如果是自己的业务表需要实现数据权限，需要有 `dept_id` 和 `user_id` 这两个字段。
:::

### 在 Controller 层使用

使用 `@DataScopeSql` 参数装饰器，获取到数据范围 `sql` 语句。

> 你需要往下层传递 sql 语句，并且包含数据权限的接口都要添加。

```ts{4}
import { DataScope, DataScopeSql } from '@vivy-common/datascope'
export class UserController {
  @DataScope({ deptAlias: 'd', userAlias: 'u' })
  async list(@DataScopeSql() dsSql: string) {
    return await this.userService.list(dsSql)
  }
}
```

```ts{6}
export class UserService {
  async list(dsSql: string) {
    return this.userRepository
      .createQueryBuilder('u')
      .leftJoin('sys_dept', 'd', 'd.dept_id = u.dept_id')
      .andWhere(dsSql)
      .getMany()
  }
}
```

### 在 Service 层使用(推荐)

使用 `dataScopeService.sql` 方法，获取到数据范围 `sql` 语句。

> 它从 [异步上下文](./context.md) 中获取用户信息，你可以随意调用包含数据权限的方法而无需传递参数。

```ts{5,9}
import { DataScope, DataScopeService } from '@vivy-common/datascope'
export class UserService {
  @DataScope({ deptAlias: 'd', userAlias: 'u' })
  async list() {
    const dsSql = this.dataScopeService.sql(this.list)
    return this.userRepository
      .createQueryBuilder('u')
      .leftJoin('sys_dept', 'd', 'd.dept_id = u.dept_id')
      .andWhere(dsSql)
      .getMany()
  }
}
```

### 在 Mapper 层使用(推荐)

同 `Service` 层使用方法。`Mapper` 层是由 [Mybatis](../plugin/mapper.md) 插件提供的。

```ts{5}
import { DataScope, DataScopeService } from '@vivy-common/datascope'
export class UserMapper {
  @DataScope({ deptAlias: 'd', userAlias: 'u' })
  async list() {
    const dsSql = this.dataScopeService.sql(this.list)
    const sql = this.mybatisService.getSql('user.mapper', 'list', { dsSql })
    return this.dataSource.query(sql)
  }
}
```

```xml{8}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="user.mapper">
  <select id="list">
    select u.*
    from sys_user u
      left join sys_dept d on u.dept_id = d.dept_id
    where ${dsSql}
  </select>
</mapper>
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-datascope

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system/src/modules/system/user

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system/src/modules/system/dept
