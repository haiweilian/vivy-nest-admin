export interface LoginResultVo {
  /**
   * 过期时间
   */
  expires_in: number

  /**
   * 权限令牌
   */
  access_token: string
}
