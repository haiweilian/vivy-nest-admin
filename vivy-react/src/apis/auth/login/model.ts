/**
 * 登录参数
 */
export interface LoginParams {
  /**
   * 验证码 code
   */
  code?: string

  /**
   * 验证码 uuid
   */
  uuid?: string

  /**
   * 用户名
   */
  username: string

  /**
   * 用户密码
   */
  password: string
}

/**
 * 登录信息
 */
export interface LoginResult {
  /**
   * 过期时间
   */
  expires_in: number

  /**
   * 权限令牌
   */
  access_token: string
}

/**
 * 图片验证码
 */
export interface ImageCaptchaResult {
  /* 验证码 img */
  img: string

  /* 验证码 uuid */
  uuid: string
}
