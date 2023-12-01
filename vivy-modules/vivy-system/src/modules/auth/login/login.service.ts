import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { SysLoginUser, ServiceException, PasswordUtils, UserStatusEnums, CacheConstants } from '@vivy-common/core'
import { isEmpty } from 'lodash'
import * as svgCaptcha from 'svg-captcha'
import { ConfigService } from '@/modules/system/config/config.service'
import { UserService } from '@/modules/system/user/user.service'
import { LoginDto } from './dto/login.dto'
import { ImageCaptchaVo } from './vo/login.vo'

/**
 * 登录管理
 * @author vivy
 */
@Injectable()
export class LoginService {
  constructor(
    @InjectRedis()
    public redis: Redis,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  /**
   * 用户登录
   * @param form 登录账户信息
   */
  async login(form: LoginDto): Promise<SysLoginUser> {
    const { username, password } = form
    if (isEmpty(username) || isEmpty(password)) {
      throw new ServiceException('用户/密码必须填写')
    }

    const data = await this.userService.selectLoginByUserName(username)
    const user = data?.sysUser
    if (isEmpty(data)) {
      throw new ServiceException('登录用户不存在')
    }

    if (UserStatusEnums.DISABLE === user.status) {
      throw new ServiceException('您的账号已停用')
    }

    if (UserStatusEnums.DELETED === user.delFlag) {
      throw new ServiceException('您的账号已删除')
    }

    const isMatch = await PasswordUtils.compare(password, user.password)
    if (!isMatch) {
      throw new ServiceException('密码输入错误')
    }

    return data
  }

  /**
   * 创建图片验证码
   */
  async createImageCaptcha(): Promise<ImageCaptchaVo> {
    const { data, text } = svgCaptcha.createMathExpr({
      noise: 3,
      width: 120,
      height: 40,
      color: true,
    })

    const result = {
      img: data,
      uuid: randomUUID(),
    }

    const key = `${CacheConstants.CAPTCHA_CODE_KEY}${result.uuid}`
    await this.redis.set(key, text, 'EX', 60 * 5)

    return result
  }

  /**
   * 验证图片验证码
   * @param form 登录账户信息
   * @returns 验证失败抛出错误信息
   */
  async verifyImageCaptcha(form: LoginDto): Promise<void> {
    const key = `${CacheConstants.CAPTCHA_CODE_KEY}${form.uuid}`
    const code = await this.redis.get(key)
    if (!code) {
      throw new ServiceException('验证码已过期')
    }
    if (code !== form.code) {
      throw new ServiceException('验证码输入错误')
    }
  }

  /**
   * 是否启用验证码功能
   * @returns true 启用 / false 不启用
   */
  async isEnableImageCaptcha() {
    const enableCaptcha = await this.configService.getConfigValueByKey('sys.account.enableCaptcha')
    if (enableCaptcha && enableCaptcha === 'true') {
      return true
    }
    return false
  }
}
