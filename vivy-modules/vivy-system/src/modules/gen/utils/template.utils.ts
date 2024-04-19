import * as camelcase from 'camelcase'
import * as decamelize from 'decamelize'
import * as handlebars from 'handlebars'
import './handlebars.helpers'
import { GenTableColumn } from '../gen/entities/gen-table-column.entity'
import { GenTable } from '../gen/entities/gen-table.entity'
import { GenConstants } from './gen.constants'
import { GenUtils } from './gen.utils'

interface TemplateItem {
  name: string
  files: string[]
}

interface ColumnContext extends GenTableColumn {
  /** 属性显示名称 */
  fieldLabel?: string

  /** 字典类型驼峰 */
  dictTypeCamelcase?: string

  /** 数据库类型信息 */
  columnLength?: string
  columnPrecision?: string
  columnScale?: string
}

interface CompileContext extends GenTable {
  /**
   * 常量值
   */
  constants: GenConstants

  /**
   * 实体类命名格式
   */
  classNameCamelcase: string
  classNamePascalCase: string
  classNameKebabCase: string

  /**
   * 业务名命名格式
   */
  businessNameCamelcase: string
  businessNamePascalCase: string
  businessNameKebabCase: string

  /**
   * 主键列
   */
  pkColumn: ColumnContext

  /**
   * 字典列
   */
  dictColumn: ColumnContext[]

  /**
   * 标签类型
   */
  htmlTypeList: string[]
}

/**
 * 模板工具类
 * @author vivy
 */
export class TemplateUtils {
  /**
   * 获取模板列表
   * @return 模板列表
   */
  static getTemplateList(): TemplateItem[] {
    return [
      {
        name: 'Nest',
        files: [
          'nest/[name].module.hbs',
          'nest/[name].controller.hbs',
          'nest/[name].service.hbs',
          'nest/dto/[name].dto.hbs',
          'nest/entities/[name].entity.hbs',
        ],
      },
      {
        name: 'React',
        files: ['react/index.hbs', 'react/components/UpdateForm.hbs', 'react/apis/index.hbs', 'react/apis/model.hbs'],
      },
    ]
  }

  /**
   * 获取文件名
   * @param template 模板名称
   * @param table 生成表信息
   * @return 文件生成路径
   */
  static getFileName(template: string, table: GenTable) {
    let name = ''
    const context = this.getCompileContext(table)

    // Nest
    if (template.startsWith('nest')) {
      if (template.startsWith('nest/entities')) {
        name = template.replace('.hbs', '.ts').replace('[name]', context.classNameKebabCase)
      } else {
        name = template.replace('.hbs', '.ts').replace('[name]', context.businessNameKebabCase)
      }
    }

    // React
    if (template.startsWith('react')) {
      if (template.startsWith('react/apis')) {
        name = template.replace('.hbs', '.ts')
      } else {
        name = template.replace('.hbs', '.tsx')
      }
    }

    return name
  }

  /**
   * 编译模板代码
   * @param template 模板内容
   * @param table 生成表信息
   * @return 模板结果
   */
  static compileTemplate(template: string, table: GenTable) {
    const context = this.getCompileContext(table)
    return handlebars.compile(template)(context)
  }

  /**
   * 构建编译上下文
   * @param 生成表信息
   * @returns 上下文
   */
  static getCompileContext(table: GenTable) {
    const context: CompileContext = table as CompileContext

    /**
     * 常量值
     */
    context.constants = GenConstants

    /**
     * 实体类命名格式
     */
    context.classNameCamelcase = camelcase(table.className)
    context.classNamePascalCase = camelcase(table.className, { pascalCase: true })
    context.classNameKebabCase = decamelize(table.className, { separator: '-' })

    /**
     * 业务名命名格式
     */
    context.businessNameCamelcase = camelcase(table.businessName)
    context.businessNamePascalCase = camelcase(table.businessName, { pascalCase: true })
    context.businessNameKebabCase = decamelize(table.businessName, { separator: '-' })

    /**
     * 列处理
     */
    table.columns.forEach((column: ColumnContext) => {
      // 根据列备注提取标签名
      if (column.columnComment) {
        column.fieldLabel = column.columnComment.replace(/\(.+\)/, '').replace(/（.+）/, '')
      }

      // 根据字典类型获取变量名
      if (column.dictType) {
        column.dictTypeCamelcase = camelcase(column.dictType)
      }

      // 根据列字段类型获取字段长度
      if (column.columnType) {
        const dataType = GenUtils.getColumnType(column.columnType)
        if (GenConstants.COLUMNTYPE_NUMBER.includes(dataType)) {
          const match = GenUtils.getColumnMatchLength(column.columnType)?.split(',')
          if (match && match.length === 2) {
            column.columnPrecision = match[0]
            column.columnScale = match[1]
          }
        } else {
          const match = GenUtils.getColumnMatchLength(column.columnType)?.split(',')
          if (match && match.length) {
            column.columnLength = match[0]
          }
        }
        column.columnType = dataType
      }
    })

    /**
     * 主键列
     */
    context.pkColumn = table.columns.find((column) => GenUtils.isRequire(column.isPk))
    if (!context.pkColumn) {
      context.pkColumn = table.columns[0]
    }

    /**
     * 字典列
     */
    context.dictColumn = []
    table.columns.forEach((column: ColumnContext) => {
      if (column.dictType) {
        context.dictColumn.push(column)
      }
    })

    /**
     * 标签类型
     */
    context.htmlTypeList = []
    table.columns.forEach((column: ColumnContext) => {
      if (column.htmlType) {
        context.htmlTypeList.push(column.htmlType)
      }
    })

    return context
  }
}
