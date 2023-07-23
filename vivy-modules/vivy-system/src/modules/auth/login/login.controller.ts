import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { LoginType } from '@vivy-common/logger'
import { Public, TokenUtils } from '@vivy-common/security'
import { LoginInfoDto } from './dto/login.dto'
import { LogService } from './log.service'
import { LoginService } from './login.service'

/**
 * 登录管理
 * @author vivy
 */
@ApiTags('登录管理')
@ApiBearerAuth()
@Controller()
export class LoginController {
  constructor(
    private tokenUtils: TokenUtils,
    private logService: LogService,
    private loginService: LoginService
  ) {}

  /**
   * 用户登录
   * @param form 登录账户信息
   */
  @Post('login')
  @Public()
  async login(@Body() form: LoginInfoDto): Promise<AjaxResult> {
    try {
      const user = await this.loginService.login(form)
      const token = await this.tokenUtils.createToken(user)
      this.logService.ok(LoginType.ACCOUNT_PASSWORD, form.username, '登录成功')
      return AjaxResult.success(token, '登录成功')
    } catch (error) {
      this.logService.fail(LoginType.ACCOUNT_PASSWORD, form.username, error?.message)
      throw error
    }
  }

  /**
   * 用户退出
   */
  @Post('logout')
  async logout(): Promise<AjaxResult> {
    const token = this.tokenUtils.getToken()
    if (token) {
      await this.tokenUtils.delLoginUser(token)
    }
    return AjaxResult.success(null, '退出成功')
  }

  /**
   * 刷新 Token
   */
  @Post('refresh')
  async refresh(): Promise<AjaxResult> {
    const token = this.tokenUtils.getToken()
    if (token) {
      const loginUser = await this.tokenUtils.getLoginUser(token)
      if (loginUser) {
        await this.tokenUtils.refreshToken(loginUser)
      }
    }
    return AjaxResult.success(null, '刷新成功')
  }

  /**
   * 根据 Token 获取缓存的用户信息
   */
  @Get('getLoginUserInfo')
  async getLoginUserInfo(): Promise<AjaxResult> {
    const token = this.tokenUtils.getToken()
    const loginUser = await this.tokenUtils.getLoginUser(token)
    delete loginUser?.sysUser?.password
    return AjaxResult.success(loginUser)
  }
}
