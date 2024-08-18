import { Injectable } from '@nestjs/common'
import { PasswordUtils, ServiceException } from '@vivy-common/core'
import { TokenService } from '@vivy-common/security'
import { DeptService } from '@/modules/system/dept/dept.service'
import { RoleService } from '@/modules/system/role/role.service'
import { UserService } from '@/modules/system/user/user.service'
import { UpdateAvatarDto, UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto'
import { ProfileInfoVo } from './vo/profile.vo'

/**
 * 个人信息
 * @author vivy
 */
@Injectable()
export class ProfileService {
  constructor(
    private deptService: DeptService,
    private roleService: RoleService,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  /**
   * 个人信息
   */
  async info(): Promise<ProfileInfoVo> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const userInfo: ProfileInfoVo = loginUser.sysUser
    userInfo.dept = userInfo.deptId && (await this.deptService.info(userInfo.deptId))
    userInfo.roles = await this.roleService.selectRoleByUserId(userInfo.userId)
    return userInfo
  }

  /**
   * 修改个人信息
   * @param profile 个人信息
   */
  async update(profile: UpdateProfileDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)

    if (!(await this.userService.checkUserEmailUnique(profile.email, loginUser.userId))) {
      throw new ServiceException(`修改用户${loginUser.userName}失败，邮箱账号已存在`)
    }

    if (!(await this.userService.checkUserPhoneUnique(profile.phonenumber, loginUser.userId))) {
      throw new ServiceException(`修改用户${loginUser.userName}失败，手机号码已存在`)
    }

    await this.userService.updateBasicInfo(loginUser.userId, profile)

    // 更新缓存用户信息
    Object.assign(loginUser.sysUser, profile)
    await this.tokenService.setLoginUser(loginUser)
  }

  /**
   * 修改个人密码
   * @param password 密码信息
   */
  async password(password: UpdatePasswordDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const curPassword = loginUser.sysUser.password
    const { oldPassword, newPassword } = password

    if (!(await PasswordUtils.compare(oldPassword, curPassword))) {
      throw new ServiceException(`修改密码失败，旧密码错误`)
    }

    if (await PasswordUtils.compare(newPassword, curPassword)) {
      throw new ServiceException(`新密码不能与旧密码相同`)
    }

    const hashPassword = await PasswordUtils.create(newPassword)
    await this.userService.updateBasicInfo(loginUser.userId, {
      password: hashPassword,
    })

    // 更新缓存用户信息
    Object.assign(loginUser.sysUser, { password: hashPassword })
    await this.tokenService.setLoginUser(loginUser)
  }

  /**
   * 修改个人头像
   * @param avatar 头像地址
   */
  async avatar(avatar: UpdateAvatarDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)

    await this.userService.updateBasicInfo(loginUser.userId, avatar)

    // 更新缓存用户信息
    Object.assign(loginUser.sysUser, avatar)
    await this.tokenService.setLoginUser(loginUser)
  }
}
