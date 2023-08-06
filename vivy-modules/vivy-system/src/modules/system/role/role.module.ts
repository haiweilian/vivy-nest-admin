import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysUserRole } from '@/modules/system/user/entities/sys-user-role.entity'
import { SysRoleDept } from './entities/sys-role-dept.entity'
import { SysRoleMenu } from './entities/sys-role-menu.entity'
import { SysRole } from './entities/sys-role.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysRole, SysRoleDept, SysRoleMenu, SysUserRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
