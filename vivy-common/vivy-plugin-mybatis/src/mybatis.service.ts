import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import * as chokidar from 'chokidar'
import * as glob from 'fast-glob'
import * as fse from 'fs-extra'
import * as mybatisMapper from 'mybatis-mapper'
import { MYBATIS_OPTIONS } from './mybatis.constants'
import { MybatisOptions, MybatisParams, MybatisFormat } from './mybatis.interface'
import { MybatisMapper } from './mybatis.mapper'

@Injectable()
export class MybatisService<M = MybatisMapper> implements OnModuleInit {
  constructor(@Inject(MYBATIS_OPTIONS) private options: MybatisOptions) {}

  onModuleInit() {
    this.loadMapper()
  }

  /**
   * 获取 SQL 语句
   * @param namespace 命名空间
   * @param sql sql id
   * @param param 参数
   * @param format 格式
   */
  getSql<N extends keyof M & string, S extends M[N] & string>(
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
    const files = glob.globSync(patterns, { absolute: true })
    mybatisMapper.createMapper(files)
    this.generateMapper()

    const { watch = true } = this.options
    if (!watch) return
    const watcher = chokidar.watch(patterns)
    watcher.on('add', (file) => {
      mybatisMapper.createMapper([file])
      this.generateMapper()
    })
    watcher.on('change', (file) => {
      mybatisMapper.createMapper([file])
      this.generateMapper()
    })
    watcher.on('unlink', (file) => {
      // TODO: only clean deleted
      const mapper = mybatisMapper.getMapper()
      Object.keys(mapper).forEach((key) => {
        delete mapper[key]
      })

      const files = glob.globSync(patterns, { absolute: true })
      mybatisMapper.createMapper(files)
      this.generateMapper()
    })
  }

  /**
   * 生成 Mapper 声明
   */
  private generateMapper() {
    const { dtsPath } = this.options
    if (!dtsPath) return

    const mapper = mybatisMapper.getMapper()
    const code = `// 此文件在运行时重新生成
/* eslint-disable */
/* prettier-ignore */
interface MybatisMapper {
${Object.keys(mapper)
  .map((key) => {
    const value = Object.keys(mapper[key])
    return `  '${key}': ${value.length ? value.map((v) => `'${v}'`).join(' | ') : 'string'}`
  })
  .join('\n')}
}
`

    const prev = fse.pathExistsSync(dtsPath) && fse.readFileSync(dtsPath, 'utf-8')
    if (code !== prev) {
      fse.outputFileSync(dtsPath, code, 'utf-8')
    }
  }
}
