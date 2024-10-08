import { BullModule } from '@nestjs/bull'
import { Module, Provider } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JOB_BULL_NAME } from '@/common/constants/bull.constants'

import { SysJobLog } from './entities/sys-job-log.entity'
import { SysJob } from './entities/sys-job.entity'
import { JobLogController } from './job-log.controller'
import { JobLogService } from './job-log.service'
import { JobQueueService } from './job-queue.service'
import { JobController } from './job.controller'
import { JobProcessor } from './job.processor'
import { JobService } from './job.service'

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
