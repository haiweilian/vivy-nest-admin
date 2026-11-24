import { resolve } from 'path'
import { Inject, Injectable } from '@nestjs/common'
import lodash from 'lodash'
import { WinstonLogger } from 'nest-winston'
import { createLogger } from 'winston'
import { LOGGER_OPTIONS } from './logger.constants.js'
import type { LoggerOptions } from './logger.interface.js'
import { WinstonTransportBuilder } from './winston.transport.js'

const { assign } = lodash

const defaultOptions: LoggerOptions = {
  appName: 'vivy',
  logPath: resolve(process.cwd(), 'logs'),
}

/**
 * 自定义 NestJs 日志
 */
@Injectable()
export class NestLogger extends WinstonLogger {
  constructor(@Inject(LOGGER_OPTIONS) options: LoggerOptions) {
    const TransportBuilder = new WinstonTransportBuilder(assign(defaultOptions, options))
    super(
      createLogger({
        transports: [
          TransportBuilder.buildConsoleTransportInstance(),
          TransportBuilder.buildDailyRotateFileTransportInstance({
            filename: resolve(options.logPath, `${options.appName}-%DATE%.log`),
          }),
        ],
      })
    )
  }
}
