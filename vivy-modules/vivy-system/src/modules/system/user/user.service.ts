import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { ServiceException, PasswordUtils, IdentityUtils, UserConstants } from '@vivy-common/core'
import { ExcelService } from '@vivy-common/excel'
import { isNotEmpty, isEmpty, isArray, isObject } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, In, Like, Repository } from 'typeorm'
import { ConfigService } from '@/modules/system/config/config.service'
import { DeptService } from '@/modules/system/dept/dept.service'
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
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>,

    @InjectRepository(SysUserRole)
    private userRoleRepository: Repository<SysUserRole>,

    @InjectRepository(SysUserPost)
    private userPostRepository: Repository<SysUserPost>,

    private deptService: DeptService,
    private menuService: MenuService,
    private roleService: RoleService,
    private excelService: ExcelService,
    private configService: ConfigService
  ) {}

  /**
   * 用户列表
   * @param user 用户信息
   * @returns 用户列表
   */
  async list(user: ListUserDto): Promise<Pagination<SysUser>> {
    const childIds = await this.deptService.selectChildIds(user.deptId)

    return paginate<SysUser>(
      this.userRepository,
      {
        page: user.page,
        limit: user.limit,
      },
      {
        where: {
          status: user.status,
          deptId: isNotEmpty(user.deptId) ? In([user.deptId, ...childIds]) : undefined,
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

    await this.dataSource.transaction(async (manager) => {
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
   * @param userId 用户ID
   * @param user 用户信息
   */
  async update(userId: number, user: UpdateUserDto): Promise<void> {
    const { roleIds, postIds, ...userInfo } = user

    await this.dataSource.transaction(async (manager) => {
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
    await this.dataSource.transaction(async (manager) => {
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
   * 更新用户基本信息
   * @param userId 用户ID
   * @param user 用户信息
   */
  async updateBasicInfo(userId: number, user: Partial<SysUser>): Promise<void> {
    await this.userRepository.update(userId, user)
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
   * @param userName 用户名称
   * @param userId 用户ID
   * @returns true 唯一 / false 不唯一
   */
  async checkUserNameUnique(userName: string, userId?: number): Promise<boolean> {
    const info = await this.userRepository.findOneBy({ userName })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * 校验用户邮箱是否唯一
   * @param email 用户邮箱
   * @param userId 用户ID
   * @returns true 唯一 / false 不唯一
   */
  async checkUserEmailUnique(email: string, userId?: number): Promise<boolean> {
    if (!email) return true

    const info = await this.userRepository.findOneBy({ email })
    if (info && info.userId !== userId) {
      return false
    }

    return true
  }

  /**
   * 校验用户手机号是否唯一
   * @param phonenumber 用户手机号
   * @param userId 用户ID
   * @returns true 唯一 / false 不唯一
   */
  async checkUserPhoneUnique(phonenumber: string, userId?: number): Promise<boolean> {
    if (!phonenumber) return true

    const info = await this.userRepository.findOneBy({ phonenumber })
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
   * 获取角色权限
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
   * 获取菜单权限
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

  /**
   * 导出用户
   */
  async export() {
    const data = await this.userRepository.find()
    const buffer = await this.excelService.export(SysUser, data)
    return buffer
  }

  /**
   * 导出模板
   */
  async exportTemplate() {
    const buffer = await this.excelService.exportTemplate(SysUser, {
      exclude: ['sex', 'avatar'],
    })
    return buffer
  }

  /**
   * 导入用户
   * @param buffer 导入文件
   */
  async import(buffer: Buffer) {
    const data = await this.excelService.import(SysUser, buffer)
    const password = await this.configService.value('sys.user.initPassword')

    // TODO: Data validation
    for (const user of data) {
      user.password = await PasswordUtils.create(password)
    }

    await this.userRepository.insert(data)
  }
}
