import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysUser } from '@/modules/system/user/entities/sys-user.entity.js'
import { DeptController } from './dept.controller.js'
import { DeptService } from './dept.service.js'
import { SysDept } from './entities/sys-dept.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysDept, SysUser])],
  controllers: [DeptController],
  providers: [DeptService],
  exports: [DeptService],
})
export class DeptModule {}
