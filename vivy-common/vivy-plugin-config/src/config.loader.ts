import * as fs from 'fs'
import * as path from 'path'
import { Inject, Injectable } from '@nestjs/common'
import { mergeWith, isArray } from 'lodash'
import * as YAML from 'yaml'
import { CONFIG_OPTIONS } from './config.constants'
import { ConfigOptions } from './config.interface'

/**
 * 加载配置文件
 */
@Injectable()
export class ConfigLoader {
  private readonly files: string[]

  constructor(@Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions) {
    this.files = this.getFilesPath()
  }

  public load(): any {
    this.checkFileExists()

    const configs: any[] = []
    this.files.forEach((file) => {
      configs.push(this.loadFile(file))
    })

    return mergeWith({}, ...configs, (objValue: any, srcValue: any) => {
      if (isArray(objValue)) {
        return srcValue
      }
    })
  }

  private checkFileExists() {
    if (this.files.length === 0) {
      throw new Error(`file path was not found`)
    }

    let existFiles = 0
    for (let i = 0; i < this.files.length; i++) {
      if (fs.existsSync(this.files[i])) {
        existFiles++
      }
    }
    if (existFiles === 0) {
      throw new Error(`file path was not found`)
    }
  }

  public loadFile(path: string): any {
    let config = {}
    if (!fs.existsSync(path)) {
      return config
    }
    const configStr = fs.readFileSync(path).toString()
    try {
      config = YAML.parse(configStr)
    } catch (e) {
      try {
        config = JSON.parse(configStr)
      } catch (e) {
        throw new Error(`file ${path} parse error`)
      }
    }
    return config
  }

  private getFilesPath(): string[] {
    const filenames: string[] = []
    const env = this.options.env || process.env.NODE_ENV || 'development'
    const dir = this.options.dir || process.cwd()
    const extension = this.options.extension || 'yaml'

    filenames.push(path.resolve(dir, `config.${extension}`))
    filenames.push(path.resolve(dir, `config.local.${extension}`))
    filenames.push(path.resolve(dir, `config.${env}.${extension}`))
    filenames.push(path.resolve(dir, `config.${env}.local.${extension}`))

    return filenames
  }
}
