import { Module } from '@nestjs/common'
import { JobModule } from './job/job.module'
import { LoginLogModule } from './login-log/login-log.module'
import { OnlineUserModule } from './online-user/online-user.module'
import { OperLogModule } from './oper-log/oper-log.module'

@Module({
  imports: [JobModule, OnlineUserModule, OperLogModule, LoginLogModule],
})
export class MonitorModule {}
