import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// entities
import { SysDept } from '@/entities/sys-dept.entity'
import { SysDictData } from '@/entities/sys-dict-data.entity'
import { SysDictType } from '@/entities/sys-dict-type.entity'
import { SysLoginLog } from '@/entities/sys-login-log.entity'
import { SysMenu } from '@/entities/sys-menu.entity'
import { SysOperLog } from '@/entities/sys-oper-log.entity'
import { SysPost } from '@/entities/sys-post.entity'
import { SysRoleDept } from '@/entities/sys-role-dept.entity'
import { SysRoleMenu } from '@/entities/sys-role-menu.entity'
import { SysRole } from '@/entities/sys-role.entity'
import { SysUserPost } from '@/entities/sys-user-post.entity'
import { SysUserRole } from '@/entities/sys-user-role.entity'
import { SysUser } from '@/entities/sys-user.entity'

// modules
import { DeptController } from './dept/dept.controller'
import { DeptService } from './dept/dept.service'
import { DictDataController } from './dict-data/dict-data.controller'
import { DictDataService } from './dict-data/dict-data.service'
import { DictTypeController } from './dict-type/dict-type.controller'
import { DictTypeService } from './dict-type/dict-type.service'
import { LoginLogController } from './login-log/login-log.controller'
import { LoginLogService } from './login-log/login-log.service'
import { MenuController } from './menu/menu.controller'
import { MenuService } from './menu/menu.service'
import { OperLogController } from './oper-log/oper-log.controller'
import { OperLogService } from './oper-log/oper-log.service'
import { PostController } from './post/post.controller'
import { PostService } from './post/post.service'
import { RoleController } from './role/role.controller'
import { RoleService } from './role/role.service'
import { PermissionService } from './user/permission.service'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysUser,
      SysUserRole,
      SysUserPost,
      SysDept,
      SysRole,
      SysRoleDept,
      SysRoleMenu,
      SysPost,
      SysMenu,
      SysDictType,
      SysDictData,
      SysOperLog,
      SysLoginLog,
    ]),
  ],
  controllers: [
    UserController,
    DeptController,
    RoleController,
    PostController,
    MenuController,
    DictTypeController,
    DictDataController,
    OperLogController,
    LoginLogController,
  ],
  providers: [
    UserService,
    PermissionService,
    DeptService,
    RoleService,
    PostService,
    MenuService,
    DictTypeService,
    DictDataService,
    OperLogService,
    LoginLogService,
  ],
  exports: [UserService, OperLogService, LoginLogService],
})
export class SystemModule {}
