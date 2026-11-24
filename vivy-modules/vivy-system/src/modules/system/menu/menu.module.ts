import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysRoleMenu } from '@/modules/system/role/entities/sys-role-menu.entity.js'
import { SysMenu } from './entities/sys-menu.entity.js'
import { MenuController } from './menu.controller.js'
import { MenuService } from './menu.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysMenu, SysRoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
