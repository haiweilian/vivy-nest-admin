import { Module } from '@nestjs/common'
import { SystemModule } from '@/modules/system/system.module'
import { LogService } from './login/log.service'
import { LoginController } from './login/login.controller'
import { LoginService } from './login/login.service'

@Module({
  imports: [SystemModule],
  controllers: [LoginController],
  providers: [LogService, LoginService],
})
export class AuthModule {}
