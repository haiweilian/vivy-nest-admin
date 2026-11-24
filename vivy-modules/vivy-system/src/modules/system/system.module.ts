import { Module } from '@nestjs/common'

import { ConfigModule } from './config/config.module.js'
import { DeptModule } from './dept/dept.module.js'
import { DictModule } from './dict/dict.module.js'
import { MenuModule } from './menu/menu.module.js'
import { NoticeModule } from './notice/notice.module.js'
import { PostModule } from './post/post.module.js'
import { ProfileModule } from './profile/profile.module.js'
import { RoleModule } from './role/role.module.js'
import { UserModule } from './user/user.module.js'

@Module({
  imports: [
    UserModule,
    DeptModule,
    PostModule,
    RoleModule,
    MenuModule,
    DictModule,
    ConfigModule,
    NoticeModule,
    ProfileModule,
  ],
})
export class SystemModule {}
