import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysUserRole } from '@/modules/system/user/entities/sys-user-role.entity.js'
import { SysRoleDept } from './entities/sys-role-dept.entity.js'
import { SysRoleMenu } from './entities/sys-role-menu.entity.js'
import { SysRole } from './entities/sys-role.entity.js'
import { RoleController } from './role.controller.js'
import { RoleService } from './role.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysRole, SysRoleDept, SysRoleMenu, SysUserRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
