import * as fs from 'fs'
import * as path from 'path'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import * as chokidar from 'chokidar'
import * as glob from 'fast-glob'
import * as mybatisMapper from 'mybatis-mapper'
import { MYBATIS_OPTIONS } from './mybatis.constants'
import { MybatisOptions, MybatisParams, MybatisFormat } from './mybatis.interface'
import { MybatisMapper } from './mybatis.mapper'

@Injectable()
export class MybatisService implements OnModuleInit {
  constructor(@Inject(MYBATIS_OPTIONS) private options: MybatisOptions) {}

  onModuleInit() {
    const { watch = true } = this.options
    this.loadMapper()
    watch && this.watchMapper()
  }

  /**
   * 获取 SQL 语句
   * @param namespace 命名空间
   * @param sql sql id
   * @param param 参数
   * @param format 格式
   */
  getSql<N extends keyof MybatisMapper & string, S extends MybatisMapper[N] & string>(
    namespace: N,
    sql: S,
    param?: MybatisParams,
    format?: MybatisFormat
  ) {
    return mybatisMapper.getStatement(
      namespace,
      sql,
      param,
      Object.assign({}, this.options.format || {}, format) as any
    )
  }

  /**
   * 加载 Mapper 文件
   */
  private loadMapper() {
    const { patterns = [] } = this.options
    const files = glob.globSync(patterns, {
      absolute: true,
    })

    // TODO: only clean deleted
    const mapper = mybatisMapper.getMapper()
    Object.keys(mapper).forEach((key) => {
      delete mapper[key]
    })

    mybatisMapper.createMapper(files)
    this.generateMapper()
  }

  /**
   * 监听 Mapper 文件
   */
  private watchMapper() {
    const { patterns = [] } = this.options
    chokidar.watch(patterns).on('all', () => {
      // TODO: only load changed
      this.loadMapper()
    })
  }

  /**
   * 生成 Mapper 声明
   */
  private generateMapper() {
    const { dts = true } = this.options
    const mapper = mybatisMapper.getMapper()
    let code = ''

    if (dts) {
      code = `// 此文件在运行时重新生成
export interface MybatisMapper {
  ${Object.keys(mapper)
    .map((key) => {
      const value = Object.keys(mapper[key])
      return `'${key}': ${value.length ? value.map((v) => `'${v}'`).join(' | ') : 'string'}`
    })
    .join('\n')}
}
`
    } else {
      code = `// 此文件在运行时重新生成
export interface MybatisMapper {
  [index: string]: string
}
`
    }

    const out = path.join(__dirname, 'mybatis.mapper.d.ts')
    const prev = fs.readFileSync(out, 'utf-8')
    if (code !== prev) {
      fs.writeFileSync(out, code, 'utf-8')
    }
  }
}
