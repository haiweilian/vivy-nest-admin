import { Injectable } from '@nestjs/common'
import { SysLoginUser, ServiceException, PasswordUtils, UserStatusEnums } from '@vivy-common/core'
import { isEmpty } from 'lodash'
import { UserService } from '@/modules/system/user/user.service'
import { LoginInfoDto } from './dto/login.dto'

/**
 * 登录管理
 * @author vivy
 */
@Injectable()
export class LoginService {
  constructor(private userService: UserService) {}

  /**
   * 用户登录
   * @param form 登录账户信息
   */
  async login(form: LoginInfoDto): Promise<SysLoginUser> {
    const { username, password } = form
    if (isEmpty(username) || isEmpty(password)) {
      throw new ServiceException('用户/密码必须填写')
    }

    const data = await this.userService.selectLoginByUserName(username)
    const user = data?.sysUser
    if (isEmpty(data)) {
      throw new ServiceException('登录用户不存在')
    }

    if (UserStatusEnums.DELETED === user.delFlag) {
      throw new ServiceException('您的账号已删除')
    }

    if (UserStatusEnums.DISABLE === user.status) {
      throw new ServiceException('您的账号已停用')
    }

    const isMatch = await PasswordUtils.compare(password, user.password)
    if (!isMatch) {
      throw new ServiceException('密码输入错误')
    }

    return data
  }

  /**
   * 用户退出
   */
  async logout() {
    throw new Error('Method not implemented.')
  }

  /**
   * 刷新 Token
   */
  async refresh() {
    throw new Error('Method not implemented.')
  }
}
