import { Module } from '@nestjs/common'
import { LoginLogModule } from '@/modules/monitor/login-log/login-log.module.js'
import { ConfigModule } from '@/modules/system/config/config.module.js'
import { MenuModule } from '@/modules/system/menu/menu.module.js'
import { UserModule } from '@/modules/system/user/user.module.js'
import { LogService } from './log.service.js'
import { LoginController } from './login.controller.js'
import { LoginService } from './login.service.js'

@Module({
  imports: [UserModule, MenuModule, ConfigModule, LoginLogModule],
  controllers: [LoginController],
  providers: [LogService, LoginService],
})
export class LoginModule {}
