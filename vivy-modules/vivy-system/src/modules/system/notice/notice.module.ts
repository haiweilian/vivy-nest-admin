import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysNotice } from './entities/sys-notice.entity'
import { NoticeController } from './notice.controller'
import { NoticeService } from './notice.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysNotice])],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
