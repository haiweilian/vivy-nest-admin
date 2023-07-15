/**
 * 缓存 Key 常量
 */
export class CacheConstants {
  /**
   * 缓存有效期，默认720（分钟）
   */
  static readonly EXPIRATION = 720

  /**
   * 缓存刷新时间，默认120（分钟）
   */
  static readonly REFRESH_TIME = 120

  /**
   * 权限 cache key
   */
  static readonly LOGIN_TOKEN_KEY = 'login_token:'

  /**
   * 验证码 cache key
   */
  static readonly CAPTCHA_CODE_KEY = 'captcha_code:'

  /**
   * 参数管理 cache key
   */
  static readonly SYS_CONFIG_KEY = 'sys_config:'

  /**
   * 字典管理 cache key
   */
  static readonly SYS_DICT_KEY = 'sys_dict:'
}
