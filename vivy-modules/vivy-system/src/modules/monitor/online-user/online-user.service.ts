import { Injectable } from '@nestjs/common'
import { CacheConstants, DateUtils, SysLoginUser } from '@vivy-common/core'
import { TokenService } from '@vivy-common/security'
import { ListOnlineUserDto } from './dto/online-user.dto'
import { OnlineUserVo } from './vo/online-user.vo'

/**
 * 在线用户
 * @author vivy
 */
@Injectable()
export class OnlineUserService {
  constructor(private tokenService: TokenService) {}

  /**
   * 在线用户列表
   * @param dto 查询信息
   * @returns 在线用户列表
   */
  async list(dto: ListOnlineUserDto): Promise<OnlineUserVo[]> {
    const redis = this.tokenService.getRedis()
    const { loginIp = '', userName = '' } = dto
    const keys = await redis.keys(`${CacheConstants.LOGIN_TOKEN_KEY}*`)
    const promises = keys.map(async (key) => JSON.parse(await redis.get(key)))
    const loginUserList: SysLoginUser[] = await Promise.all(promises)
    const onlineUserList: OnlineUserVo[] = loginUserList
      .filter((user) => {
        return user.loginIp.includes(loginIp) && user.userName.includes(userName)
      })
      .map((user) => {
        return {
          userSk: user.userSk,
          userId: user.userId,
          userName: user.userName,
          nickName: user.sysUser.nickName,
          loginIp: user.loginIp,
          loginTime: DateUtils.formatDateTime(user.loginTime),
        }
      })
    return onlineUserList
  }

  /**
   * 强退在线用户
   * @param userSk 用户会话编号
   */
  async logout(userSk: string): Promise<void> {
    const redis = this.tokenService.getRedis()
    await redis.del(`${CacheConstants.LOGIN_TOKEN_KEY}${userSk}`)
  }
}
