import { Module } from '@nestjs/common'

import { FileModule } from '@/modules/file/file.module.js'
import { DeptModule } from '@/modules/system/dept/dept.module.js'
import { PostModule } from '@/modules/system/post/post.module.js'
import { RoleModule } from '@/modules/system/role/role.module.js'
import { UserModule } from '@/modules/system/user/user.module.js'
import { ProfileController } from './profile.controller.js'
import { ProfileService } from './profile.service.js'

@Module({
  imports: [DeptModule, RoleModule, PostModule, UserModule, FileModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
