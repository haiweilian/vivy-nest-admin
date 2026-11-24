import { Module } from '@nestjs/common'
import { LoginModule } from './login/login.module.js'

@Module({
  imports: [LoginModule],
})
export class AuthModule {}
