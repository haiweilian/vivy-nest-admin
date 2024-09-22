import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { SysLoginUser, ServiceException, PasswordUtils, BaseIsEnum, UserStatusEnum } from '@vivy-common/core'
import { isEmpty } from 'class-validator'
import Redis from 'ioredis'
import * as svgCaptcha from 'svg-captcha'
import { CAPTCHA_CODE_KEY } from '@/common/constants/cache.constants'
import { ConfigService } from '@/modules/system/config/config.service'
import { MenuService } from '@/modules/system/menu/menu.service'
import { MenuTreeVo } from '@/modules/system/menu/vo/menu.vo'
import { UserService } from '@/modules/system/user/user.service'
import { LoginDto } from './dto/login.dto'
import { CaptchaVo, RouterTreeVo } from './vo/login.vo'

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
    private menuService: MenuService,
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

    const user = await this.userService.selectUserByUserName(username)
    if (isEmpty(user)) {
      throw new ServiceException('登录用户不存在')
    }

    if (user.status === UserStatusEnum.DISABLE) {
      throw new ServiceException('您的账号已停用')
    }

    if (user.status === UserStatusEnum.DELETED) {
      throw new ServiceException('您的账号已删除')
    }

    const isMatch = await PasswordUtils.compare(password, user.password)
    if (!isMatch) {
      throw new ServiceException('密码输入错误')
    }

    const loginUser = new SysLoginUser()
    loginUser.sysUser = user
    loginUser.roles = await this.userService.getRolePermission(user.userId)
    loginUser.scopes = await this.userService.getRoleDataScope(user.userId)
    loginUser.permissions = await this.userService.getMenuPermission(user.userId)
    return loginUser
  }

  /**
   * 创建验证码
   */
  async createCaptcha(): Promise<CaptchaVo> {
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

    const key = `${CAPTCHA_CODE_KEY}${result.uuid}`
    await this.redis.set(key, text, 'EX', 60 * 5)

    return result
  }

  /**
   * 验证验证码
   * @param form 登录账户信息
   * @returns 验证失败抛出错误信息
   */
  async verifyCaptcha(form: LoginDto): Promise<void> {
    const key = `${CAPTCHA_CODE_KEY}${form.uuid}`
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
  async isEnableCaptcha() {
    const enableCaptcha = await this.configService.value('sys.account.enableCaptcha')
    if (enableCaptcha && enableCaptcha === 'true') {
      return true
    }
    return false
  }

  /**
   * 查询用户路由信息
   * @param userId 用户ID
   * @returns 用户路由信息
   */
  async getUserRouters(userId: number) {
    const menus = await this.menuService.selectUserMenuTree(userId)
    return this.buildUmiMaxRouters(menus)
  }

  /**
   * 构建前端 UmiMax 所需要的路由
   * @param 菜单列表
   * @returns 路由列表
   */
  private buildUmiMaxRouters(menus: MenuTreeVo[]): RouterTreeVo[] {
    const routers: RouterTreeVo[] = []

    for (const menu of menus) {
      const router = new RouterTreeVo()
      router.name = menu.menuName
      router.path = menu.path
      router.icon = menu.icon
      router.component = menu.component
      router.locale = false
      router.hideInMenu = menu.isVisible === BaseIsEnum.NO
      router.children = menu.children && this.buildUmiMaxRouters(menu.children)
      routers.push(router)
    }

    return routers
  }
}
