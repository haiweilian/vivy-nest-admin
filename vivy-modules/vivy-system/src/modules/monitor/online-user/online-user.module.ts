import { Module } from '@nestjs/common'

import { OnlineUserController } from './online-user.controller.js'
import { OnlineUserService } from './online-user.service.js'

@Module({
  imports: [],
  controllers: [OnlineUserController],
  providers: [OnlineUserService],
})
export class OnlineUserModule {}
