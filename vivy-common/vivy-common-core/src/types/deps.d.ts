/**
 * 临时处理循环依赖问题，手动声明模块类型。
 */
declare module '@vivy-common/logger' {
  export const LoggerModule = any
  export class LoggerService {
    error(message: any, trace?: string, context?: string)
  }
}
