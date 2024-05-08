import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { MybatisService } from '@vivy-common/mybatis'
import { DataSource } from 'typeorm'
import { GenTableColumn } from './entities/gen-table-column.entity'
import { GenTable } from './entities/gen-table.entity'

@Injectable()
export class GenMapper {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private mybatisService: MybatisService
  ) {}

  /**
   * 查询数据库表列表
   * @param name 表名称
   * @param comment 表注释
   */
  async selectDbTableList(name: string, comment: string): Promise<GenTable[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableList', {
      name: name || '',
      comment: comment || '',
    })
    return this.dataSource.query(sql)
  }

  /**
   * 根据名称查询数据库表列表
   * @param names 表名称
   */
  async selectDbTableListByNames(names: string[]): Promise<GenTable[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableListByNames', {
      names,
    })
    return this.dataSource.query(sql)
  }

  /**
   * 根据名称查询表格列列表
   * @param name 表名称
   */
  async selectDbTableColumnsByName(name: string): Promise<GenTableColumn[]> {
    const sql = this.mybatisService.getSql('gen.gen.mapper', 'selectDbTableColumnsByName', {
      name,
    })
    return this.dataSource.query(sql)
  }
}
