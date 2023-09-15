import { Injectable } from '@nestjs/common'
import { PasswordUtils, ServiceException } from '@vivy-common/core'
import { TokenService } from '@vivy-common/security'
import { DeptService } from '@/modules/system/dept/dept.service'
import { RoleService } from '@/modules/system/role/role.service'
import { UserService } from '@/modules/system/user/user.service'
import { UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto'
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
   * @param userName 用户名称
   */
  async profile(userName: string): Promise<ProfileInfoVo> {
    const userInfo: ProfileInfoVo = await this.userService.selectUserByUserName(userName)
    userInfo.dept = userInfo.deptId && (await this.deptService.info(userInfo.deptId))
    userInfo.roles = await this.roleService.selectRoleByUserId(userInfo.userId)
    userInfo.password = null
    return userInfo
  }

  /**
   * 修改个人信息
   * @param profile 个人信息
   */
  async updateProfile(profile: UpdateProfileDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const user = loginUser.sysUser
    user.email = profile.email
    user.phonenumber = profile.phonenumber

    if (!(await this.userService.checkUserEmailUnique(user))) {
      throw new ServiceException(`修改用户${user.userName}失败，邮箱账号已存在`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user))) {
      throw new ServiceException(`修改用户${user.userName}失败，手机号码已存在`)
    }

    await this.userService.updateBasicInfo({
      ...profile,
      userId: user.userId,
    })

    // 更新缓存用户信息
    Object.assign(loginUser.sysUser, profile)
    await this.tokenService.setLoginUser(loginUser)
  }

  /**
   * 修改个人密码
   * @param password 密码信息
   */
  async updatePassword(password: UpdatePasswordDto): Promise<void> {
    const token = this.tokenService.getToken()
    const loginUser = await this.tokenService.getLoginUser(token)
    const curPassword = loginUser.sysUser.password

    if (!(await PasswordUtils.compare(password.oldPassword, curPassword))) {
      throw new ServiceException(`修改密码失败，旧密码错误`)
    }

    if (await PasswordUtils.compare(password.newPassword, curPassword)) {
      throw new ServiceException(`新密码不能与旧密码相同`)
    }

    const newPassword = await PasswordUtils.create(password.newPassword)
    await this.userService.updateBasicInfo({
      password: newPassword,
      userId: loginUser.userId,
    })

    // 更新缓存用户信息
    Object.assign(loginUser.sysUser, { password: newPassword })
    await this.tokenService.setLoginUser(loginUser)
  }
}
