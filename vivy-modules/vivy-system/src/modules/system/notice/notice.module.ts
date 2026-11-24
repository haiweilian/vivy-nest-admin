import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysNotice } from './entities/sys-notice.entity.js'
import { NoticeController } from './notice.controller.js'
import { NoticeService } from './notice.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysNotice])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
