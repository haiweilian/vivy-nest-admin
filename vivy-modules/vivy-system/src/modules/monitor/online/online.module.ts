import { Module } from '@nestjs/common'

import { OnlineController } from './online.controller'
import { OnlineService } from './online.service'

@Module({
  imports: [],
  controllers: [OnlineController],
  providers: [OnlineService],
})
export class OnlineModule {}
