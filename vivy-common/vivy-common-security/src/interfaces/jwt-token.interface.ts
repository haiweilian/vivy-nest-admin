/**
 * Jwt Token 信息
 */
export interface JwtToken {
  /**
   * 用户会话
   */
  user_sk: string

  /**
   * 用户ID
   */
  user_id: number

  /**
   * 用户名
   */
  user_name: string
}
