# 系统接口

根据代码生成接口文档，由 [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) 提供，已集成到项目中。由于需要写很多的声明对代码有侵入性，目前只使用了必要的装饰器方便测试接口。

## 基础使用

- `@ApiTags()` 指定标签名称。如果需要分组则必须使用。
- `@ApiBearerAuth()` 指定身份验证。如果需要验证权限则必须使用。

```ts
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

/**
 * 用户管理
 * @author vivy
 */
@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {}
```

## 响应装饰器

装饰器继承自 `@ApiResponse` 装饰器，返回统一响应实体。

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

### @ApiDataResponse()

数据响应装饰器。

```ts
import { ApiDataResponse } from '@vivy-common/swagger'

@Controller('user')
export class UserController {
  @Get('info/:userId')
  // @ApiDataResponse(Number)
  // @ApiDataResponse(String)
  // @ApiDataResponse(Boolean)
  @ApiDataResponse(SysUser)
  // @ApiDataResponse(Array(Number))
  // @ApiDataResponse(Array(String))
  // @ApiDataResponse(Array(Boolean))
  // @ApiDataResponse(Array(SysUser))
  async info(@Param('userId') userId: number) {}
}
```

### @ApiPaginatedResponse()

分页响应装饰器。

```ts
import { ApiPaginatedResponse } from '@vivy-common/swagger'

@Controller('user')
export class UserController {
  @Get('list')
  @ApiPaginatedResponse(SysUser)
  async list(@Query() user: ListUserDto) {}
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-swagger

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/main.ts
