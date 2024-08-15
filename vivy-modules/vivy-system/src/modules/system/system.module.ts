import { Module } from '@nestjs/common'

import { ConfigModule } from './config/config.module'
import { DeptModule } from './dept/dept.module'
import { DictModule } from './dict/dict.module'
import { MenuModule } from './menu/menu.module'
import { NoticeModule } from './notice/notice.module'
import { PostModule } from './post/post.module'
import { ProfileModule } from './profile/profile.module'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'

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
