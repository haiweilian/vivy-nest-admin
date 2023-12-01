import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '@/modules/system/config/config.module'
import { MenuModule } from '@/modules/system/menu/menu.module'
import { RoleModule } from '@/modules/system/role/role.module'
import { SysUserPost } from './entities/sys-user-post.entity'
import { SysUserRole } from './entities/sys-user-role.entity'
import { SysUser } from './entities/sys-user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [MenuModule, RoleModule, ConfigModule, TypeOrmModule.forFeature([SysUser, SysUserRole, SysUserPost])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
