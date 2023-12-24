import { resolve } from 'path'
import { Injectable, LoggerService } from '@nestjs/common'
import { assign } from 'lodash'
import { Logger } from 'typeorm'
import { LoggerOptions } from './logger.interface'
import { createNestWinstonLogger } from './winston.logger'
import { WinstonTransportBuilder } from './winston.transport'

const defaultOptions: LoggerOptions = {
  appName: 'vivy',
  logPath: resolve(process.cwd(), 'logs'),
}

/**
 * 自定义 TypeORM 日志
 */
@Injectable()
export class TypeORMLogger implements Logger {
  private logger: LoggerService

  constructor(private options: LoggerOptions) {
    const TransportBuilder = new WinstonTransportBuilder(assign(defaultOptions, this.options))

    this.logger = createNestWinstonLogger({
      transports: [
        TransportBuilder.buildConsoleTransportInstance(),
        TransportBuilder.buildDailyRotateFileTransportInstance({
          level: 'warn',
          filename: resolve(options.logPath, `${options.appName}-sql-%DATE%.log`),
        }),
      ],
    })
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    this.logger.verbose('[QUERY]: ' + sql)
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    this.logger.error(`${`[FAILED QUERY]: ${sql}`} ${`[QUERY ERROR]: ${error}`}`)
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '')
    this.logger.warn(`[SLOW QUERY: ${time} ms]: ` + sql)
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string) {
    this.logger.verbose(message)
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string) {
    this.logger.verbose(message)
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.logger.verbose(message)
        break
      case 'info':
        this.logger.log(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
    }
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters)
    } catch (error) {
      // most probably circular objects in parameters
      return parameters
    }
  }
}
