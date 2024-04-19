import { resolve } from 'path'
import { Injectable } from '@nestjs/common'
import { assign } from 'lodash'
import { WinstonModule, WinstonLogger } from 'nest-winston'
import { LoggerOptions } from './logger.interface'
import { WinstonTransportBuilder } from './winston.transport'

const defaultOptions: LoggerOptions = {
  appName: 'vivy',
  logPath: resolve(process.cwd(), 'logs'),
}

/**
 * 基于类注入
 */
@Injectable()
export class LoggerService extends WinstonLogger {}

/**
 * 自定义 NestJs 日志
 */
export const NestLogger = (options: LoggerOptions = defaultOptions) => {
  const TransportBuilder = new WinstonTransportBuilder(assign(defaultOptions, options))

  return WinstonModule.createLogger({
    transports: [
      TransportBuilder.buildConsoleTransportInstance(),
      TransportBuilder.buildDailyRotateFileTransportInstance({
        filename: resolve(options.logPath, `${options.appName}-%DATE%.log`),
      }),
    ],
  })
}
