import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysLoginLog } from './entities/sys-login-log.entity.js'
import { LoginLogController } from './login-log.controller.js'
import { LoginLogService } from './login-log.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysLoginLog])],
  controllers: [LoginLogController],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
