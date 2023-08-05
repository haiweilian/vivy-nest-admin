import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { LoggerOptions } from './logger.interface'

/**
 * 构建 Winston 日志输出
 */
export class WinstonTransportBuilder {
  constructor(private readonly options: LoggerOptions) {}

  buildConsoleTransportInstance(config: winston.transports.ConsoleTransportOptions = {}) {
    return new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.options.appName, {
          colors: true,
          prettyPrint: true,
        })
      ),
      ...config,
    })
  }

  buildFileTransportInstance(config: winston.transports.FileTransportOptions = {}) {
    return new winston.transports.File({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.options.appName, {
          colors: false,
          prettyPrint: true,
        })
      ),
      ...config,
    })
  }

  buildDailyRotateFileTransportInstance(config: DailyRotateFile.DailyRotateFileTransportOptions = {}) {
    return new DailyRotateFile({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(this.options.appName, {
          colors: false,
          prettyPrint: true,
        })
      ),
      ...config,
    })
  }
}
