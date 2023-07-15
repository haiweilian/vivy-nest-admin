import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserConstants, BaseStatusEnums, IdentityUtils } from '@vivy-common/core'
import { Repository } from 'typeorm'
import { SysMenu } from '@/entities/sys-menu.entity'
import { SysRoleMenu } from '@/entities/sys-role-menu.entity'
import { SysRole } from '@/entities/sys-role.entity'
import { SysUserRole } from '@/entities/sys-user-role.entity'

/**
 * 用户权限处理
 * @author vivy
 */
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(SysRole)
    private roleRepository: Repository<SysRole>,

    @InjectRepository(SysMenu)
    private menuRepository: Repository<SysMenu>
  ) {}

  /**
   * 获取角色数据权限
   * @param userId 用户Id
   * @return 角色权限信息
   */
  async getRolePermission(userId: number): Promise<string[]> {
    const roles = new Set<string>()

    if (IdentityUtils.isAdminUser(userId)) {
      roles.add(UserConstants.SUPER_ROLE_CODE)
    } else {
      const result = await this.roleRepository
        .createQueryBuilder('r')
        .leftJoin(SysUserRole, 'ur', 'r.role_id = ur.role_id')
        .where('ur.user_id = :userId', { userId })
        .andWhere('r.status = :status', { status: BaseStatusEnums.NORMAL })
        .getMany()
      result.forEach((row) => roles.add(row.roleCode))
    }

    return [...roles]
  }

  /**
   * 获取菜单数据权限
   * @param userId 用户Id
   * @return 菜单权限信息
   */
  async getMenuPermission(userId: number): Promise<string[]> {
    const perms = new Set<string>()

    if (IdentityUtils.isAdminUser(userId)) {
      perms.add(UserConstants.SUPER_ROLE_PERMISSION)
    } else {
      const result = await this.menuRepository
        .createQueryBuilder('m')
        .leftJoin(SysRoleMenu, 'rm', 'm.menu_id = rm.menu_id')
        .leftJoin(SysUserRole, 'ur', 'rm.role_id = ur.role_id')
        .leftJoin(SysRole, 'r', 'ur.role_id = r.role_id')
        .where('ur.user_id = :userId', { userId })
        .andWhere('m.status = :status', { status: BaseStatusEnums.NORMAL })
        .andWhere('r.status = :status', { status: BaseStatusEnums.NORMAL })
        .andWhere('m.permission IS NOT NULL')
        .getMany()
      result.forEach((row) => perms.add(row.permission))
    }

    return [...perms]
  }
}
