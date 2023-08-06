import { Module } from '@nestjs/common'

import { DeptModule } from './dept/dept.module'
import { DictDataModule } from './dict-data/dict-data.module'
import { DictTypeModule } from './dict-type/dict-type.module'
import { LoginLogModule } from './login-log/login-log.module'
import { MenuModule } from './menu/menu.module'
import { OperLogModule } from './oper-log/oper-log.module'
import { PostModule } from './post/post.module'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    DeptModule,
    DictDataModule,
    DictTypeModule,
    LoginLogModule,
    MenuModule,
    OperLogModule,
    PostModule,
    RoleModule,
    UserModule,
  ],
})
export class SystemModule {}
