# 定时任务

实现动态管理任务，可以达到动态控制定时任务启动、暂停、重启、删除、添加、修改等操作，极大地方便了开发过程。基于 [@nestjs/bull](https://docs.nestjs.com/techniques/queues) 消息队列实现。

## 添加定时任务

后台添加定时任务处理类，并使用 `@Taskable()` 装饰器表明此类可以被定时任务处理。

```ts
// vivy-modules/vivy-system/src/modules/monitor/job/tasks/call.task.ts
@Taskable()
@Injectable()
export class CallTask {
  private log = console.log

  async noParams() {
    this.log('noParams')
  }
}
```

然后添加到 `taskProviders` 数组中它将处理别名和注入容器。

```ts
import { CallTask } from './tasks/call.task'
import { HttpTask } from './tasks/http.task'

const taskProviders = [CallTask, HttpTask]
const taskAliasProviders = taskProviders.map<Provider>((task) => {
  // 创建字符串别名，以便可以通过字符串类型获取定义的 Service
  return {
    provide: task.name,
    useExisting: task,
  }
})

@Module({
  controllers: [JobController],
  providers: [...taskProviders, ...taskAliasProviders],
})
export class JobModule {}
```

随后你可以在 Web 页面（系统监控 -> 定时任务）添加任务，调用目标为 `CallTask.noParams` 字符串，当定时任务触发将调用 `noParams` 应用处理函数。

## 定时任务参数

定时任务参数必须能被 `JSON.parse` 解析，在调用目标时自动解析并传入参数(暂不支持多个参数)。

```ts
import { Injectable } from '@nestjs/common'
import { ServiceException } from '@vivy-common/core'
import { Taskable } from '../utils/taskable.decorator'

@Taskable()
@Injectable()
export class CallTask {
  private log = console.log

  async noParams() {
    this.log('noParams')
  }

  // 录入 1
  async numberParams(params: number) {
    this.log('numberParams', params)
  }

  // 录入 '1'
  async stringParams(params: string) {
    this.log('stringParams', params)
  }

  // 录入 true
  async booleanParams(params: boolean) {
    this.log('booleanParams', params)
  }

  // 录入 {"a":1,"b":2}
  async objectParams(params: Record<string, any>) {
    this.log('objectParams', params)
  }

  async errorParams(params: unknown) {
    this.log('errorParams', params)
    if (Math.random() > 0.5) {
      throw new Error(`errorParams: Error`)
    } else {
      throw new ServiceException('errorParams: ServiceException')
    }
  }
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system/src/modules/monitor/job
