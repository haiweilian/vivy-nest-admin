import { Module } from '@nestjs/common'
import { LoginLogModule } from '@/modules/monitor/login-log/login-log.module'
import { ConfigModule } from '@/modules/system/config/config.module'
import { MenuModule } from '@/modules/system/menu/menu.module'
import { UserModule } from '@/modules/system/user/user.module'
import { LogService } from './log.service'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

@Module({
  imports: [UserModule, MenuModule, ConfigModule, LoginLogModule],
  controllers: [LoginController],
  providers: [LogService, LoginService],
})
export class LoginModule {}
