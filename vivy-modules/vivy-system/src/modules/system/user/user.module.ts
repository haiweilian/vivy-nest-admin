import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@/modules/system/config/config.module.js'
import { DeptModule } from '@/modules/system/dept/dept.module.js'
import { MenuModule } from '@/modules/system/menu/menu.module.js'
import { RoleModule } from '@/modules/system/role/role.module.js'
import { SysUserPost } from './entities/sys-user-post.entity.js'
import { SysUserRole } from './entities/sys-user-role.entity.js'
import { SysUser } from './entities/sys-user.entity.js'
import { UserController } from './user.controller.js'
import { UserService } from './user.service.js'

@Module({
  imports: [
    MenuModule,
    DeptModule,
    RoleModule,
    ConfigModule,
    TypeOrmModule.forFeature([SysUser, SysUserRole, SysUserPost]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
