import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysOperLog } from './entities/sys-oper-log.entity.js'
import { OperLogController } from './oper-log.controller.js'
import { OperLogService } from './oper-log.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysOperLog])],
  controllers: [OperLogController],
  providers: [OperLogService],
  exports: [OperLogService],
})
export class OperLogModule {}
