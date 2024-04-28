import * as fs from 'fs/promises'
import * as path from 'path'
import { Injectable, StreamableFile } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ServiceException, SecurityContext } from '@vivy-common/core'
import * as archiver from 'archiver'
import { isEmpty, isNotEmpty } from 'class-validator'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { GenUtils } from '../utils/gen.utils'
import { TemplateUtils } from '../utils/template.utils'
import { ListGenDto, UpdateGenDto } from './dto/gen.dto'
import { GenTableColumn } from './entities/gen-table-column.entity'
import { GenTable } from './entities/gen-table.entity'
import { GenMapper } from './gen.mapper'
import { GenPreviewVo } from './vo/gen.vo'

/**
 * 代码生成
 * @author vivy
 */
@Injectable()
export class GenService {
  constructor(
    @InjectRepository(GenTable)
    private tableRepository: Repository<GenTable>,

    @InjectRepository(GenTableColumn)
    private tableColumnRepository: Repository<GenTableColumn>,

    private genMapper: GenMapper,
    private securityContext: SecurityContext
  ) {}

  /**
   * 代码生成列表
   * @param gen 搜索信息
   * @returns 代码生成列表
   */
  async list(gen: ListGenDto): Promise<Pagination<GenTable>> {
    return paginate<GenTable>(
      this.tableRepository,
      {
        page: gen.page,
        limit: gen.limit,
      },
      {
        where: {
          tableName: isNotEmpty(gen.tableName) ? Like(`%${gen.tableName}%`) : undefined,
          tableComment: isNotEmpty(gen.tableComment) ? Like(`%${gen.tableComment}%`) : undefined,
        },
      }
    )
  }

  /**
   * 更新代码生成
   * @param gen 更新信息
   */
  async update(gen: UpdateGenDto): Promise<void> {
    gen.updateBy = this.securityContext.getUserName()
    await this.tableRepository.save(gen)
  }

  /**
   * 删除代码生成
   * @param tableIds 代码生成ID
   */
  async delete(tableIds: number[]): Promise<void> {
    await this.tableRepository.delete(tableIds)
  }

  /**
   * 代码生成详情
   * @param tableId 代码生成ID
   * @returns 代码生成详情
   */
  async info(tableId: number): Promise<GenTable> {
    return this.tableRepository.findOne({
      where: {
        tableId,
      },
      relations: {
        columns: true,
      },
    })
  }

  /**
   * 查询数据库表列表
   * @param tableId 代码生成ID
   * @returns 数据库表列表
   */
  async dblist(gen: ListGenDto): Promise<GenTable[]> {
    return this.genMapper.selectDbTableList(gen.tableName, gen.tableComment)
  }

  /**
   * 导入表结构到代码生成表
   * @param tableNames 表名称
   */
  async import(tableNames: string[]): Promise<void> {
    const tables = await this.genMapper.selectDbTableListByNames(tableNames)
    for (const table of tables) {
      table.createBy = this.securityContext.getUserName()
      GenUtils.initTable(table)
      const columns = await this.genMapper.selectDbTableColumnsByName(table.tableName)
      for (const column of columns) {
        GenUtils.initColumn(column, table)
      }
      table.columns = columns
    }
    await this.tableRepository.save(tables)
  }

  /**
   * 同步表结构到代码生成表
   * @param tableName 表名称
   */
  async sync(tableName: string): Promise<any> {
    const dbColumns = await this.genMapper.selectDbTableColumnsByName(tableName)
    if (isEmpty(dbColumns)) {
      throw new ServiceException('同步数据失败，原表结构不存在')
    }

    // 获取到旧字段列信息并转换为对象便于查询
    const table = await this.tableRepository.findOne({
      where: {
        tableName,
      },
      relations: {
        columns: true,
      },
    })
    const tableColumnMap = new Map()
    table.columns.forEach((column) => {
      tableColumnMap.set(column.columnName, column)
    })

    // 获取到新字段列信息并把旧字段列信息的必要字段保留
    dbColumns.forEach((column) => {
      GenUtils.initColumn(column, table)

      const oldColumn = tableColumnMap.get(column.columnName)
      if (isEmpty(oldColumn)) return

      // 如果是列表，继续保留查询方式/字典类型选项
      if (GenUtils.isRequire(column.isList)) {
        column.dictType = oldColumn.dictType
        column.queryType = oldColumn.queryType
      }

      // 如果是(新增/修改&非主键)，继续保留必填/显示类型选项
      if (
        !GenUtils.isRequire(column.isPk) &&
        (GenUtils.isRequire(column.isEdit) || GenUtils.isRequire(column.isInsert))
      ) {
        column.htmlType = oldColumn.htmlType
        column.isRequired = oldColumn.isRequired
      }
    })

    // 删除全部重新插入 // todo: 待优化按需更新、插入、删除
    await this.tableColumnRepository.delete({ tableId: table.tableId })
    await this.tableColumnRepository.insert(dbColumns)
  }

  /**
   * 预览代码
   * @param tableName 表名称
   * @returns 代码详情
   */
  async preview(tableName: string): Promise<GenPreviewVo[]> {
    const result: GenPreviewVo[] = []

    // 查询表信息
    const table = await this.tableRepository.findOne({
      where: {
        tableName,
      },
      relations: {
        columns: true,
      },
    })

    // 获取模板列表
    const templates = TemplateUtils.getTemplateList()
    for (const template of templates) {
      const item: GenPreviewVo = { name: template.name, files: [] }
      result.push(item)

      // 渲染模板代码
      for (const file of template.files) {
        const raw = await fs.readFile(path.join(__dirname, '../template', file), 'utf-8')
        const name = TemplateUtils.getFileName(file, table)
        const code = TemplateUtils.compileTemplate(raw, table)
        item.files.push({ name, code })
      }
    }

    return result
  }

  /**
   * 下载代码
   * @param tableName 表名称
   * @returns 代码详情
   */
  async download(tableName: string): Promise<StreamableFile> {
    const preview = await this.preview(tableName)
    const archive = archiver('zip')

    for (const code of preview) {
      for (const file of code.files) {
        archive.append(file.code, { name: `${tableName}/${file.name}` })
      }
    }
    archive.finalize()

    return new StreamableFile(archive)
  }
}
