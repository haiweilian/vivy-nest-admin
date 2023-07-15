import { Allow } from 'class-validator'

export class LoginInfoDto {
  /**
   * 用户名
   */
  @Allow()
  username: string

  /**
   * 用户密码
   */
  @Allow()
  password: string
}
