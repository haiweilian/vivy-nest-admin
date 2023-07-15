import { FactoryProvider } from '@nestjs/common'

export interface LoggerOptions {
  /**
   * 应用名称
   * @default vivy
   */
  appName?: string
  /**
   * 日志路径
   * @default path.resolve(process.cwd(), 'logs')
   */
  logPath?: string
}

export interface LoggerAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<LoggerOptions> | LoggerOptions
  inject?: FactoryProvider['inject']
}
