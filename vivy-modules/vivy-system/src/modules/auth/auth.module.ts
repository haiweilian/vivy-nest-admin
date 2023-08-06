import { Module } from '@nestjs/common'
import { LoginModule } from './login/login.module'

@Module({
  imports: [LoginModule],
})
export class AuthModule {}
