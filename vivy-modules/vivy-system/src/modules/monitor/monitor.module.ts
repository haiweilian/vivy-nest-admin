import { Module } from '@nestjs/common'
import { OnlineModule } from './online/online.module'

@Module({
  imports: [OnlineModule],
})
export class MonitorModule {}
