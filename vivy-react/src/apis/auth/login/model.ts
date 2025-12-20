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
   * 权限令牌
   */
  token: string

  /**
   * 过期时间
   */
  expiresIn: number
}

/**
 * 验证码
 */
export interface CaptchaResult {
  /* 验证码 img */
  img: string

  /* 验证码 uuid */
  uuid: string
}

/**
 * 路由树
 */
export interface RouterTreeResult {
  /** 菜单的名字 */
  name: string

  /** 路径,可以设定为网页链接 */
  path: string

  /** 菜单的 icon */
  icon: string

  /** 自定义菜单的国际化 key */
  locale: string | false

  /** 子菜单 */
  children: RouterTreeResult[]

  /** 在菜单中隐藏自己和子节点 */
  hideInMenu: boolean

  /** 在菜单中隐藏子节点 */
  hideChildrenInMenu: boolean

  /** 当此节点被选中的时候也会选中 parentKeys 的节点 */
  parentKeys: string[]

  [key: string]: any
}
