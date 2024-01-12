import { Module } from '@nestjs/common'
import { JobModule } from './job/job.module'
import { OnlineModule } from './online/online.module'

@Module({
  imports: [JobModule, OnlineModule],
})
export class MonitorModule {}
