import { Module } from '@nestjs/common'
import { CacheModule } from './cache/cache.module.js'
import { JobModule } from './job/job.module.js'
import { LoginLogModule } from './login-log/login-log.module.js'
import { OnlineUserModule } from './online-user/online-user.module.js'
import { OperLogModule } from './oper-log/oper-log.module.js'

@Module({
  imports: [JobModule, CacheModule, OnlineUserModule, OperLogModule, LoginLogModule],
})
export class MonitorModule {}
