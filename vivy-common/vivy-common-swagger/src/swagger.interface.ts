export interface SwaggerOptions {
  /**
   * 是否开启
   */
  enabled?: boolean
  /**
   * 标题
   */
  title?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 版本
   */
  version?: string
  /**
   * 服务条款
   */
  termsOfService?: string
  /**
   * 许可证
   */
  license?: {
    name: string
    url: string
  }
  /**
   * 联系人信息
   */
  contact?: {
    name: string
    url: string
    email: string
  }
  /**
   * 外部文档
   */
  externalDoc?: {
    url: string
    description: string
  }
}
