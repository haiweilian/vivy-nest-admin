import { Allow } from 'class-validator'

/**
 * 查询在线用户
 */
export class ListOnlineUserDto {
  /** IP地址 */
  @Allow()
  loginIp?: string

  /** 用户名称 */
  @Allow()
  userName?: string
}
