import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysRoleMenu } from '@/modules/system/role/entities/sys-role-menu.entity'
import { SysMenu } from './entities/sys-menu.entity'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysMenu, SysRoleMenu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
