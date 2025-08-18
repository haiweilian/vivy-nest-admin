# 系统日志

## 外部日志

在实际开发中，我们通常需要把日志(错误日志、手动打印日志) 存储到本地文件中，以便我们在生产环境便于排查错误。内部使用 [Winston](https://github.com/winstonjs/winston) 完全 [自定义日志](https://docs.nestjs.com/techniques/logger) 来替换内部的记录器。

在应用中一个好的实践是实例化 `Logger` 类，这将与具体的实现无关。

```ts
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name)

  getHello(): string {
    this.logger.log('logger log')
    this.logger.warn('logger warn')
    this.logger.error('logger error')
  }
}
```

以上调用将在控制台和本地文件中输出以下内容。

```sh
# vivy-modules/vivy-system/logs/vivy-system-2023-09-01.log
[vivy-system] Info      2023/9/1 14:09:58 [AppService] logger log - {} +1m
[vivy-system] Warn      2023/9/1 14:09:58 [AppService] logger warn - {} +1ms
[vivy-system] Error     2023/9/1 14:09:58 [AppService] logger error - {} +1ms
```

## 操作日志

在实际开发中，对于某些关键业务，我们通常需要记录该操作的内容，一个操作调一次记录方法，每次还得去收集参数等等，会造成大量代码重复。我们希望代码中只有业务相关的操作，在项目中使用装饰器来完成此项功能。

在需要被记录日志的请求方法上添加 `@Log` 装饰器，使用方法如下：

```ts{4}
import { Log, OperType } from '@vivy-common/logger'
export class UserController {
  @Post('add')
  @Log({ title: '用户管理', operType: OperType.INSERT })
  async add(): Promise<AjaxResult> {}
}
```

### 装饰器参数

```ts
class LogOptions {
  /**
   * 日志标题
   */
  title: string

  /**
   * 操作类型
   * OTHER 其它, SELECT 查询, INSERT 新增, UPDATE 修改, DELETE 删除,
   * GRANT 授权, EXPORT 导出, IMPORT 导入, FORCE 强退, GENCODE 生成代码, CLEAN 清空数据
   */
  operType?: OperType = OperType.OTHER

  /**
   * 是否保存请求的参数
   */
  isSaveRequestData?: boolean = true

  /**
   * 是否保存响应的参数
   */
  isSaveResponseData?: boolean = true
}
```

### 自定义操作类型

1. 在 `OperType` 中新增业务操作类型。

```ts{7}
enum OperType {
  // ...

  /**
   * 测试
   */
  TEST,
}
```

2. 在 `sys_dict_data` 字典数据表中添加操作类型。

```sql
INSERT INTO `sys_dict_data` VALUES (21, 'sys_oper_type', '测试', '11', 11, '0', NULL, NULL, 'admin', sysdate(), 'admin', sysdate());
```

3. 在 `Controller` 中使用注解。

```ts{3}
import { Log, OperType } from '@vivy-common/logger'
export class TestController {
  @Log({ title: '测试标题', operType: OperType.TEST })
  async test(): Promise<AjaxResult> {}
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-common/vivy-common-logger

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/main.ts

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/app.module.ts

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-modules/vivy-system/src/base/interceptors/log.interceptor.ts
