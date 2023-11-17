import { randomUUID } from 'crypto'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Redis, InjectRedis } from '@nestjs-modules/ioredis'
import { IpUtils, CacheConstants, SecurityConstants, SecurityContext, type SysLoginUser } from '@vivy-common/core'
import { Request } from 'express'
import { JwtToken } from '../interfaces/jwt-token.interface'

/**
 * 令牌验证工具类
 */
@Injectable()
export class TokenService {
  constructor(
    @InjectRedis()
    public redis: Redis,
    private jwtService: JwtService,
    private securityContext: SecurityContext
  ) {}

  private MILLIS_SECOND = 1000

  private MILLIS_MINUTE = 60 * this.MILLIS_SECOND

  private MILLIS_MINUTE_REFRESH = CacheConstants.REFRESH_TIME * this.MILLIS_MINUTE

  /**
   * 获取令牌
   */
  getToken(req?: Request): string | null {
    return this.securityContext.getToken(req)
  }

  /**
   * 解析令牌
   */
  parseToken(token: string): JwtToken | null {
    if (!token) return null
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      return null
    }
  }

  /**
   * 创建令牌
   */
  async createToken(loginUser: SysLoginUser) {
    const userSk = randomUUID()
    const userId = loginUser.sysUser.userId
    const userName = loginUser.sysUser.userName
    loginUser.userSk = userSk
    loginUser.userId = userId
    loginUser.userName = userName
    loginUser.loginIp = IpUtils.requestIp(this.securityContext.getRequest())
    await this.setLoginUser(loginUser)

    // Jwt存储信息
    const payload: JwtToken = {
      [SecurityConstants.USER_SK]: userSk,
      [SecurityConstants.USER_ID]: userId,
      [SecurityConstants.USER_NAME]: userName,
    }

    // 接口返回信息
    const result = {
      expires_in: CacheConstants.EXPIRATION,
      access_token: this.jwtService.sign(payload),
    }

    return result
  }

  /**
   * 设置用户身份信息
   */
  async setLoginUser(loginUser: SysLoginUser) {
    return this.refreshToken(loginUser)
  }

  /**
   * 获取用户身份信息
   */
  async getLoginUser(token: string): Promise<SysLoginUser | null> {
    if (!token) return null
    try {
      const key = this.getLoginSk(token)
      const user = await this.redis.get(key)
      return JSON.parse(user)
    } catch (error) {
      return null
    }
  }

  /**
   * 删除用户缓存信息
   */
  async delLoginUser(token: string): Promise<boolean> {
    if (!token) return false
    try {
      const key = this.getLoginSk(token)
      return !!(await this.redis.del(key))
    } catch (error) {
      return false
    }
  }

  /**
   * 是否存在用户缓存信息
   */
  async hasLoginUser(token: string): Promise<boolean> {
    if (!token) return false
    try {
      const key = this.getLoginSk(token)
      return !!(await this.redis.get(key))
    } catch (error) {
      return false
    }
  }

  /**
   * 验证令牌有效期，相差不足120分钟，自动刷新缓存
   */
  async verifyTokenExpire(loginUser: SysLoginUser) {
    const expireTime = loginUser.expireTime
    const currentTime = Date.now()
    if (expireTime - currentTime <= this.MILLIS_MINUTE_REFRESH) {
      await this.refreshToken(loginUser)
    }
  }

  /**
   * 刷新令牌有效期
   */
  async refreshToken(loginUser: SysLoginUser) {
    loginUser.loginTime = Date.now()
    loginUser.expireTime = loginUser.loginTime + CacheConstants.EXPIRATION * this.MILLIS_MINUTE

    const key = this.appendSkPrefix(loginUser.userSk)
    const user = JSON.stringify(loginUser)
    await this.redis.set(key, user, 'EX', CacheConstants.EXPIRATION * 60)
  }

  /**
   * 获取令牌缓存 key
   */
  private getLoginSk(token: string): string {
    return this.appendSkPrefix(this.parseToken(token)[SecurityConstants.USER_SK])
  }

  /**
   * 添加令牌缓存 key 前缀
   */
  private appendSkPrefix(key: string): string {
    return CacheConstants.LOGIN_TOKEN_KEY + key
  }
}
