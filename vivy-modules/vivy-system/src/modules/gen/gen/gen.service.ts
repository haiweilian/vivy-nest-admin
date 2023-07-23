import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { ServiceException } from '@vivy-common/core'
import { isEmpty } from 'lodash'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { EntityManager, Like, Repository } from 'typeorm'
import { GenTableColumn } from '@/entities/gen-table-column.entity'
import { GenTable } from '@/entities/gen-table.entity'
import { GenUtils } from '../utils/gen.utils'
import { ListGenDto, UpdateGenDto } from './dto/gen.dto'

/**
 * 代码生成
 * @author vivy
 */
@Injectable()
export class GenService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,

    @InjectRepository(GenTable)
    private tableRepository: Repository<GenTable>,

    @InjectRepository(GenTableColumn)
    private tableColumnRepository: Repository<GenTableColumn>
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
          tableName: Like(`%${gen.tableName}%`),
          tableComment: Like(`%${gen.tableComment}%`),
        },
      }
    )
  }

  /**
   * 更新代码生成
   * @param gen 更新信息
   */
  async update(gen: UpdateGenDto): Promise<void> {
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
    return this.selectDbTableList(gen.tableName, gen.tableComment)
  }

  /**
   * 导入表结构到代码生成表
   * @param tableNames 表名称
   */
  async import(tableNames: string[]): Promise<void> {
    const tables = await this.selectDbTableListByNames(tableNames)
    for (const table of tables) {
      GenUtils.initTable(table)
      const columns = await this.selectDbTableColumnsByName(table.tableName)
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
    const dbColumns = await this.selectDbTableColumnsByName(tableName)
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
  async preview(tableName: number): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   * 下载代码
   * @param tableName 表名称
   * @returns 代码详情
   */
  async download(tableName: number): Promise<any> {
    throw new Error('Method not implemented.')
  }

  /**
   * 查询数据库表列表
   * @param name 表名称
   * @param comment 表注释
   */
  private async selectDbTableList(name: string, comment: string): Promise<GenTable[]> {
    return this.entityManager.query<GenTable[]>(
      `SELECT
        table_name AS tableName,
        table_comment AS tableComment,
        create_time AS createTime,
        update_time AS updateTime
      FROM
        information_schema.TABLES
      WHERE
        table_schema = ( SELECT DATABASE () )
        AND table_name NOT LIKE 'gen_%'
        AND table_name NOT IN ( SELECT table_name FROM gen_table )
        AND lower( table_name ) LIKE lower(concat( '%', ?, '%' ))
        AND lower( table_comment ) LIKE lower(concat( '%', ?, '%' ))
      ORDER BY
        create_time DESC
    `,
      [name, comment]
    )
  }

  /**
   * 根据名称查询数据库表列表
   * @param names 表名称
   */
  private async selectDbTableListByNames(names: string[]): Promise<GenTable[]> {
    return this.entityManager.query<GenTable[]>(
      `SELECT
        table_name AS tableName,
        table_comment AS tableComment,
        create_time AS createTime,
        update_time AS updateTime
      FROM
        information_schema.TABLES
      WHERE
        table_schema = ( SELECT DATABASE () )
        AND table_name NOT LIKE 'gen_%'
        AND table_name NOT IN ( SELECT table_name FROM gen_table )
        AND table_name IN( ${Array(names.length).fill('?').join()} )
    `,
      [...names]
    )
  }

  /**
   * 根据名称查询表格列列表
   * @param name 表名称
   */
  private async selectDbTableColumnsByName(name: string): Promise<GenTableColumn[]> {
    return this.entityManager.query<GenTableColumn[]>(
      `SELECT
        column_name AS columnName,
        column_type AS columnType,
        ordinal_position AS columnSort,
        column_comment AS columnComment,
        ( CASE WHEN column_key = 'PRI' THEN '0' ELSE '1' END ) AS isPk,
        ( CASE WHEN ( is_nullable = 'no' && column_key != 'PRI' ) THEN '0' ELSE '1' END ) AS isRequired,
        ( CASE WHEN extra = 'auto_increment' THEN '0' ELSE '1' END ) AS isIncrement
      FROM
        information_schema.COLUMNS
      WHERE
        table_schema = ( SELECT DATABASE () )
        AND table_name = ?
      ORDER BY
        ordinal_position
    `,
      [name]
    )
  }
}
