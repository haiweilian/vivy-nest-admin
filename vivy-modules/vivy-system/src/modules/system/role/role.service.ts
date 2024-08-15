import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { ServiceException, BaseStatusEnums, UserConstants, IdentityUtils } from '@vivy-common/core'
import { isNotEmpty, isEmpty, isArray, isObject } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Not, Repository } from 'typeorm'
import { SysUserRole } from '@/modules/system/user/entities/sys-user-role.entity'
import { ListRoleDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto'
import { SysRoleDept } from './entities/sys-role-dept.entity'
import { SysRoleMenu } from './entities/sys-role-menu.entity'
import { SysRole } from './entities/sys-role.entity'
import { RoleInfoVo } from './vo/role.vo'

/**
 * 角色管理
 * @author vivy
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysRole)
    private roleRepository: Repository<SysRole>,

    @InjectRepository(SysRoleMenu)
    private roleMenuRepository: Repository<SysRoleMenu>,

    @InjectRepository(SysRoleDept)
    private roleDeptRepository: Repository<SysRoleDept>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>
  ) {}

  /**
   * 角色列表
   * @param role 角色信息
   * @returns 角色列表
   */
  async list(role: ListRoleDto): Promise<Pagination<SysRole>> {
    return paginate<SysRole>(
      this.roleRepository,
      {
        page: role.page,
        limit: role.limit,
      },
      {
        order: {
          roleSort: 'ASC',
        },
        where: {
          status: role.status,
          roleName: isNotEmpty(role.roleName) ? Like(`%${role.roleName}%`) : undefined,
          roleCode: isNotEmpty(role.roleCode) ? Like(`%${role.roleCode}%`) : undefined,
        },
      }
    )
  }

  /**
   * 添加角色
   * @param role 角色信息
   */
  async add(role: CreateRoleDto): Promise<void> {
    const { menuIds, deptIds, ...roleInfo } = role

    await this.dataSource.transaction(async (manager) => {
      // 新增角色信息
      const result = await manager.insert(SysRole, roleInfo)
      const roleId = result.identifiers[0].roleId

      // 新增角色与菜单关联
      if (!isEmpty(menuIds)) {
        await manager.insert(
          SysRoleMenu,
          menuIds.map((menuId) => ({ roleId, menuId }))
        )
      }

      // 新增角色与部门关联
      if (!isEmpty(deptIds)) {
        await manager.insert(
          SysRoleDept,
          deptIds.map((deptId) => ({ roleId, deptId }))
        )
      }
    })
  }

  /**
   * 更新角色
   * @param roleId 角色ID
   * @param role 角色信息
   */
  async update(roleId: number, role: UpdateRoleDto): Promise<void> {
    const { menuIds, deptIds, ...roleInfo } = role

    await this.dataSource.transaction(async (manager) => {
      // 修改角色信息
      await manager.update(SysRole, roleId, roleInfo)

      // 删除并新增角色与菜单关联
      await manager.delete(SysRoleMenu, { roleId })
      if (!isEmpty(menuIds)) {
        await manager.insert(
          SysRoleMenu,
          menuIds.map((menuId) => ({ roleId, menuId }))
        )
      }

      // 删除并新增角色与部门关联
      await manager.delete(SysRoleDept, { roleId })
      if (!isEmpty(deptIds)) {
        await manager.insert(
          SysRoleDept,
          deptIds.map((deptId) => ({ roleId, deptId }))
        )
      }
    })
  }

  /**
   * 删除角色
   * @param roleIds 角色ID
   */
  async delete(roleIds: number[]): Promise<void> {
    for (const roleId of roleIds) {
      const count = await this.userRoleRepository.countBy({ roleId })
      if (count > 0) {
        const role = await this.roleRepository.findOneBy({ roleId })
        throw new ServiceException(`${role.roleName}已分配,不能删除`)
      }
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysRole, roleIds)
      await manager.delete(SysRoleMenu, { roleId: In(roleIds) })
      await manager.delete(SysRoleDept, { roleId: In(roleIds) })
    })
  }

  /**
   * 角色详情
   * @param roleId 角色ID
   * @returns 角色详情
   */
  async info(roleId: number): Promise<RoleInfoVo> {
    const role = await this.roleRepository.findOneBy({ roleId })
    const menus = await this.roleMenuRepository.findBy({ roleId })
    const depts = await this.roleDeptRepository.findBy({ roleId })
    return {
      ...role,
      menuIds: menus.map((menu) => menu.menuId),
      deptIds: depts.map((dept) => dept.deptId),
    }
  }

  /**
   * 校验角色是否允许操作，检验失败抛出错误
   * @param role 角色信息
   */
  checkRoleAllowed(role: Partial<SysRole> | number[] | number) {
    const Exception = new ServiceException('不允许操作超级管理员角色')

    if (isArray(role)) {
      for (const id of role) {
        if (IdentityUtils.isAdminRole(id)) {
          throw Exception
        }
      }
    } else if (isObject(role)) {
      if (IdentityUtils.isAdminRole(role.roleId)) {
        throw Exception
      }
    } else {
      if (IdentityUtils.isAdminRole(role)) {
        throw Exception
      }
    }
  }

  /**
   * 校验角色名称是否唯一
   * @param roleName 角色名称
   * @param roleId 角色ID
   * @returns true 唯一 / false 不唯一
   */
  async checkRoleNameUnique(roleName: string, roleId?: number): Promise<boolean> {
    const info = await this.roleRepository.findOneBy({ roleName })
    if (info && info.roleId !== roleId) {
      return false
    }

    return true
  }

  /**
   * 校验角色编码是否唯一
   * @param roleCode 角色编码
   * @param roleId 角色ID
   * @returns true 唯一 / false 不唯一
   */
  async checkRoleCodeUnique(roleCode: string, roleId?: number): Promise<boolean> {
    const info = await this.roleRepository.findOneBy({ roleCode })
    if (info && info.roleId !== roleId) {
      return false
    }

    return true
  }

  /**
   * 角色选项列表
   * @returns 角色选项列表
   */
  async options(): Promise<SysRole[]> {
    return this.roleRepository.find({
      select: ['roleId', 'roleName', 'roleCode'],
      order: {
        roleSort: 'ASC',
      },
      where: {
        roleId: Not(UserConstants.SUPER_ROLE),
        status: BaseStatusEnums.NORMAL,
      },
    })
  }

  /**
   * 根据用户ID查询角色列表
   * @param userId 用户用户ID
   * @returns 用户角色列表
   */
  async selectRoleByUserId(userId: number): Promise<SysRole[]> {
    return this.roleRepository
      .createQueryBuilder('r')
      .leftJoin('sys_user_role', 'ur', 'r.role_id = ur.role_id')
      .where('ur.user_id = :userId', { userId })
      .andWhere('r.status = :status', { status: BaseStatusEnums.NORMAL })
      .getMany()
  }
}
