import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { ServiceException, PasswordUtils, IdentityUtils, SysLoginUser, UserConstants } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { isEmpty, isArray, isObject } from 'lodash'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { EntityManager, In, Like, Repository } from 'typeorm'
import { MenuService } from '@/modules/system/menu/menu.service'
import { RoleService } from '@/modules/system/role/role.service'
import { ListUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { SysUserPost } from './entities/sys-user-post.entity'
import { SysUserRole } from './entities/sys-user-role.entity'
import { SysUser } from './entities/sys-user.entity'
import { UserInfoVo } from './vo/user.vo'

/**
 * 用户管理
 * @author vivy
 */
@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectRepository(SysUserPost)
    private userPostRepository: Repository<SysUserPost>,

    private menuService: MenuService,
    private roleService: RoleService
  ) {}

  /**
   * 用户列表
   * @param user 用户信息
   * @returns 用户列表
   */
  async list(user: ListUserDto): Promise<Pagination<SysUser>> {
    return paginate<SysUser>(
      this.userRepository,
      {
        page: user.page,
        limit: user.limit,
      },
      {
        where: {
          status: user.status,
          deptId: user.deptId,
          userName: isNotEmpty(user.userName) ? Like(`%${user.userName}%`) : undefined,
          nickName: isNotEmpty(user.nickName) ? Like(`%${user.nickName}%`) : undefined,
        },
      }
    )
  }

  /**
   * 添加用户
   * @param user 用户信息
   */
  async add(user: CreateUserDto): Promise<void> {
    const { roleIds, postIds, ...userInfo } = user

    await this.entityManager.transaction(async (manager) => {
      // 新增用户信息
      userInfo.password = await PasswordUtils.create(user.password)
      const result = await manager.insert(SysUser, userInfo)
      const userId = result.identifiers[0].userId

      // 新增用户与角色关联
      if (!isEmpty(roleIds)) {
        await manager.insert(
          SysUserRole,
          roleIds.map((roleId) => ({ userId, roleId }))
        )
      }

      // 新增用户与岗位关联
      if (!isEmpty(postIds)) {
        await manager.insert(
          SysUserPost,
          postIds.map((postId) => ({ userId, postId }))
        )
      }
    })
  }

  /**
   * 更新用户
   * @param user 用户信息
   */
  async update(user: UpdateUserDto): Promise<void> {
    const { roleIds, postIds, userId, ...userInfo } = user

    await this.entityManager.transaction(async (manager) => {
      // 修改用户信息
      await manager.update(SysUser, userId, userInfo)

      // 删除并新增用户与角色关联
      await manager.delete(SysUserRole, { userId })
      if (!isEmpty(roleIds)) {
        await manager.insert(
          SysUserRole,
          roleIds.map((roleId) => ({ userId, roleId }))
        )
      }

      // 删除并新增用户与岗位关联
      await manager.delete(SysUserPost, { userId })
      if (!isEmpty(postIds)) {
        await manager.insert(
          SysUserPost,
          postIds.map((postId) => ({ userId, postId }))
        )
      }
    })
  }

  /**
   * 删除用户
   * @param userIds 用户ID
   */
  async delete(userIds: number[]): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      await manager.delete(SysUser, userIds)
      await manager.delete(SysUserRole, { userId: In(userIds) })
      await manager.delete(SysUserPost, { userId: In(userIds) })
    })
  }

  /**
   * 用户详情
   * @param userId 用户ID
   * @returns 用户详情
   */
  async info(userId: number): Promise<UserInfoVo> {
    const user = await this.userRepository.findOneBy({ userId })
    const roles = await this.userRoleRepository.findBy({ userId })
    const posts = await this.userPostRepository.findBy({ userId })

    return {
      ...user,
      roleIds: roles.map((role) => role.roleId),
      postIds: posts.map((post) => post.postId),
    }
  }

  /**
   * 校验用户是否允许操作，检验失败抛出错误
   * @param user 用户信息
   */
  checkUserAllowed(user: Partial<SysUser> | number[] | number) {
    const Exception = new ServiceException('不允许操作超级管理员用户')

    if (isArray(user)) {
      for (const id of user) {
        if (IdentityUtils.isAdminUser(id)) {
          throw Exception
        }
      }
    } else if (isObject(user)) {
      if (IdentityUtils.isAdminUser(user.userId)) {
        throw Exception
      }
    } else {
      if (IdentityUtils.isAdminUser(user)) {
        throw Exception
      }
    }
  }

  /**
   * 校验用户名称是否唯一
   * @param user 用户信息
   * @returns true 唯一 / false 不唯一
   */
  async checkUserNameUnique(user: Partial<SysUser>): Promise<boolean> {
    const { userId, userName } = user

    const info = await this.userRepository.findOneBy({ userName })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * 根据用户名查询用户信息
   * @param userName 用户名称
   * @returns 用户信息
   */
  async selectUserByUserName(userName: string): Promise<SysUser> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({
        userName,
      })
      .getOne()
  }

  /**
   * 根据用户名查询登录信息
   * @param userName 用户名称
   * @returns 登录信息
   */
  async selectLoginByUserName(userName: string): Promise<SysLoginUser> {
    const sysUser = await this.selectUserByUserName(userName)
    if (isEmpty(sysUser)) {
      return null
    }

    const loginUser = new SysLoginUser()
    loginUser.sysUser = sysUser
    loginUser.roles = await this.getRolePermission(sysUser.userId)
    loginUser.permissions = await this.getMenuPermission(sysUser.userId)

    return loginUser
  }

  /**
   * 获取角色数据权限
   * @param userId 用户Id
   * @return 角色权限信息
   */
  async getRolePermission(userId: number): Promise<string[]> {
    if (IdentityUtils.isAdminUser(userId)) {
      return [UserConstants.SUPER_ROLE_CODE]
    } else {
      const roles = await this.roleService.selectRoleByUserId(userId)
      return roles.map((role) => role.roleCode).filter(Boolean)
    }
  }

  /**
   * 获取菜单数据权限
   * @param userId 用户Id
   * @return 菜单权限信息
   */
  async getMenuPermission(userId: number): Promise<string[]> {
    if (IdentityUtils.isAdminUser(userId)) {
      return [UserConstants.SUPER_ROLE_PERMISSION]
    } else {
      const menus = await this.menuService.selectMenuByUserId(userId)
      return menus.map((menu) => menu.permission).filter(Boolean)
    }
  }
}
