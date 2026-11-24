import { BullModule } from '@nestjs/bull'
import { Module, Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JOB_BULL_NAME } from '@/base/constants/bull.constants.js'

import { SysJobLog } from './entities/sys-job-log.entity.js'
import { SysJob } from './entities/sys-job.entity.js'
import { JobLogController } from './job-log.controller.js'
import { JobLogService } from './job-log.service.js'
import { JobQueueService } from './job-queue.service.js'
import { JobController } from './job.controller.js'
import { JobProcessor } from './job.processor.js'
import { JobService } from './job.service.js'

import { CallTask } from './tasks/call.task.js'
import { HttpTask } from './tasks/http.task.js'

const taskProviders = [CallTask, HttpTask]
const taskAliasProviders = taskProviders.map<Provider>((task) => {
  // 创建字符串别名，以便可以通过字符串类型获取定义的 Service
  return {
    provide: task.name,
    useExisting: task,
  }
})

@Module({
  imports: [
    BullModule.registerQueue({
      name: JOB_BULL_NAME,
    }),
    TypeOrmModule.forFeature([SysJob, SysJobLog]),
  ],
  controllers: [JobController, JobLogController],
  providers: [JobService, JobLogService, JobQueueService, JobProcessor, ...taskProviders, ...taskAliasProviders],
})
export class JobModule {}
