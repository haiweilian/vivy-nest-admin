import { Module } from '@nestjs/common'
import { LoginLogModule } from '@/modules/system/login-log/login-log.module'
import { UserModule } from '@/modules/system/user/user.module'
import { LogService } from './log.service'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

@Module({
  imports: [UserModule, LoginLogModule],
  controllers: [LoginController],
  providers: [LogService, LoginService],
})
export class LoginModule {}
