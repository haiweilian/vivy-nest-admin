export interface ConfigOptions {
  /**
   * 配置文件环境
   * @default process.env.NODE_ENV
   */
  env?: string
  /**
   * 配置文件目录
   * @default process.cwd()
   */
  dir?: string
  /**
   * 配置文件扩展名
   * @default yaml
   */
  extension?: 'yaml' | 'json'
}
