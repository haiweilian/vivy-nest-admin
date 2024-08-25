接口在返回一些敏感或隐私数据时，是需要进行脱敏处理，通常的手段是使用 \* 隐藏一部分数据。例如：

| 类型             | 原始数据            | 脱敏数据                        |
| ---------------- | ------------------- | ------------------------------- |
| 姓名(userName)   | 张三                | 张\*                            |
| 密码(password)   | 123456              | \*\*\*\*\*\*                    |
| 手机(phone)      | 15888888888         | 158\*\*\*\*8888                 |
| 邮箱(email)      | vivy@qq.com         | v\*\*\*\*@qq.com                |
| 身份证(idCard)   | 430602198812136666  | 4306\*\* \*\*\*\*\*\* \*\*6666  |
| 银行卡(bankCard) | 6211222200008888666 | \*\*\*\* \*\*\*\* \*\*\*\* 8666 |

## 使用

基于 [序列化](https://docs.nestjs.com/techniques/serialization) 功能实现。

在字段上添加 `@Sensitive` 脱敏装饰器。

```ts{4}
import { Sensitive, DesensitizedUtils } from '@vivy-common/core'

export class UserEntity {
  @Sensitive(DesensitizedUtils.phone)
  phone: string
}
```

在控制器上添加 `ClassSerializerInterceptor` 拦截器。

```ts{8}
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { AjaxResult } from '@vivy-common/core'
import { UserEntity } from './entities/user.entity'

@Controller()
export class UserController {
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  info() {
    const user = new UserEntity()
    user.phone = '18688888888'
    return AjaxResult.success(user)
  }
}
```

在响应结果中即可实现数据脱敏。

```json
{
  "data": {
    "phone": "186****8888"
  }
}
```

## 手动实例化

由于 [序列化](https://docs.nestjs.com/techniques/serialization) 的限制，必须返回实例。如果你的数据时一个普通对象可以使用 [class-transformer](https://github.com/typestack/class-transformer) 的转换方法。

```ts{14}
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { AjaxResult } from '@vivy-common/core'
import { plainToInstance } from 'class-transformer'
import { UserEntity } from './entities/user.entity'

@Controller()
export class UserController {
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  info() {
    const user = {
      phone: '18688888888',
    }
    const userInstance = plainToInstance(UserEntity, user)
    return AjaxResult.success(userInstance)
  }
}
```

在响应结果中即可实现数据脱敏。

```json
{
  "data": {
    "phone": "186****8888"
  }
}
```

## 相关源码

https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/decorators/sensitive.decorator.ts

https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-core/src/utils/sensitive/desensitized.utils.ts
