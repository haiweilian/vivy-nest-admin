import * as camelcase from 'camelcase'
import { GenTableColumn } from '../gen/entities/gen-table-column.entity'
import { GenTable } from '../gen/entities/gen-table.entity'
import { GenConstants } from './gen.constants'

/**
 * 代码生成器工具类
 * @author vivy
 */
export class GenUtils {
  /**
   * 判断当前值是否为 "是"
   * @param val 值
   */
  static isRequire(val: any) {
    return val === GenConstants.REQUIRE
  }

  /**
   * 初始化表信息(更新传入的对象)
   * @param table 表信息
   */
  static initTable(table: GenTable) {
    table.updateTime = undefined
    table.className = this.getClassName(table.tableName)
    table.businessName = this.getBusinessName(table.tableName)
    table.functionName = this.getFunctionName(table.tableComment)
    table.functionAuthor = GenConstants.AUTHOR
  }

  /**
   * 初始化列属性字段(更新传入的对象)
   * @param column 列信息
   * @param table 表信息
   */
  static initColumn(column: GenTableColumn, table: GenTable) {
    const dataType = this.getColumnType(column.columnType)
    const columnName = column.columnName

    // 设置初始值
    column.tableId = table.tableId
    column.createBy = table.createBy
    column.fieldName = camelcase(columnName)
    column.queryType = GenConstants.QUERY_EQ
    column.tslangType = GenConstants.TS_TYPE_STRING
    column.javalangType = GenConstants.JAVA_TYPE_STRING

    // 编辑字段
    if (!GenConstants.COLUMNNAME_NOT_EDIT.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isEdit = GenConstants.REQUIRE
      column.isInsert = GenConstants.REQUIRE
    }

    // 列表字段
    if (!GenConstants.COLUMNNAME_NOT_LIST.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isList = GenConstants.REQUIRE
    }

    // 查询字段
    if (!GenConstants.COLUMNNAME_NOT_QUERY.includes(columnName) && !this.isRequire(column.isPk)) {
      column.isQuery = GenConstants.REQUIRE
    }

    // 数据库字符串类型
    if (GenConstants.COLUMNTYPE_STR.includes(dataType)) {
      const match = +this.getColumnMatchLength(column.columnType)
      // 字符串长度超过500设置为文本域
      column.htmlType = match >= 500 ? GenConstants.HTML_TEXTAREA : GenConstants.HTML_INPUT
    }
    // 数据库文本类型
    else if (GenConstants.COLUMNTYPE_TEXT.includes(dataType)) {
      column.htmlType = GenConstants.HTML_TEXTAREA
    }
    // 数据库时间类型
    else if (GenConstants.COLUMNTYPE_TIME.includes(dataType)) {
      column.htmlType = GenConstants.HTML_DATETIME
      column.javalangType = GenConstants.JAVA_TYPE_DATE
    }
    // 数据库数字类型
    else if (GenConstants.COLUMNTYPE_NUMBER.includes(dataType)) {
      column.htmlType = GenConstants.HTML_NUMBER
      column.tslangType = GenConstants.TS_TYPE_NUMBER
      const match = this.getColumnMatchLength(column.columnType)?.split(',')
      // 如果是浮点型
      if (match && match.length === 2 && +match[0] > 0) {
        column.javalangType = GenConstants.JAVA_TYPE_BIGDECIMAL
      }
      // 如果是整形
      else if (match && match.length === 1 && +match[0] <= 10) {
        column.javalangType = GenConstants.JAVA_TYPE_INTEGER
      }
      // 兜底长整形
      else {
        column.javalangType = GenConstants.JAVA_TYPE_LONG
      }
    }

    // 查询字段类型
    if (this.endsWithIgnoreCase(columnName, '(name)')) {
      column.queryType = GenConstants.QUERY_LIKE
    }

    // 状态字段设置单选框
    if (this.endsWithIgnoreCase(columnName, '(status)')) {
      column.htmlType = GenConstants.HTML_RADIO
    }
    // 性别&类型字段设置下拉框
    else if (this.endsWithIgnoreCase(columnName, '(sex|type)')) {
      column.htmlType = GenConstants.HTML_SELECT
    }
    // 图片&&文件字段设置图片上传控件
    else if (this.endsWithIgnoreCase(columnName, '(file|image)')) {
      column.htmlType = GenConstants.HTML_UPLOAD
    }
    // 内容字段设置富文本控件
    else if (this.endsWithIgnoreCase(columnName, 'content')) {
      column.htmlType = GenConstants.HTML_EDITOR
    }
  }

  /**
   * 获取实体名(转为为大驼峰)
   * @param tableName 表名称
   * @return 类名
   */
  static getClassName(tableName: string): string {
    return camelcase(tableName, { pascalCase: true })
  }

  /**
   * 获取业务名(以 "_" 分割的最后一个单词)
   * @param tableName 表名称
   * @return 业务名
   */
  static getBusinessName(tableName: string): string {
    const arr = tableName.split('_')
    return camelcase(arr[arr.length - 1])
  }

  /**
   * 获取功能名(去除表注释中的特殊字符)
   * @param tableComment 表注释信息
   * @return 功能名
   */
  static getFunctionName(tableComment: string): string {
    return tableComment.replace(/(?:表)/g, '')
  }

  /**
   * 获取数据库类型字段
   * @param columnType 列类型
   * @return 截取后的列类型
   */
  static getColumnType(columnType: string): string {
    if (columnType.indexOf('(') > 0) {
      return columnType.substring(0, columnType.indexOf('('))
    } else {
      return columnType
    }
  }

  /**
   * 获取字段长度
   * @param columnType 列类型
   * @return 匹配后的长度信息
   */
  static getColumnMatchLength(columnType: string): string | null {
    return columnType.match(/(?<=\().*(?=\))/)?.[0]
  }

  /**
   * 判断是否以指定字符结尾
   * @param content 字符串内容
   * @param matchContent 匹配的内容
   * @return true/false
   */
  static endsWithIgnoreCase(content: string, matchContent: string): boolean {
    return new RegExp(`${matchContent}$`, 'i').test(content)
  }
}
