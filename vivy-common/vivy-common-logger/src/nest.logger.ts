import * as path from 'path'
import { Injectable } from '@nestjs/common'
import { assign } from 'lodash'
import { LoggerOptions } from './logger.interface'
import { createNestWinstonLogger, NestWinstonLogger } from './winston.logger'
import { WinstonTransportBuilder } from './winston.transport'

const defaultOptions: LoggerOptions = {
  appName: 'vivy',
  logPath: path.resolve(process.cwd(), 'logs'),
}

/**
 * 基于类注入
 */
@Injectable()
export class LoggerService extends NestWinstonLogger {}

/**
 * 自定义 NestJs 日志
 */
export const NestLogger = (options: LoggerOptions = defaultOptions) => {
  const TransportBuilder = new WinstonTransportBuilder(assign(defaultOptions, options))

  return createNestWinstonLogger({
    transports: [
      TransportBuilder.buildConsoleTransportInstance(),
      TransportBuilder.buildDailyRotateFileTransportInstance({
        filename: path.resolve(options.logPath, `${options.appName}-%DATE%.log`),
      }),
    ],
  })
}
