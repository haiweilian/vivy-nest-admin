import { FactoryProvider } from '@nestjs/common'
import { AddWorksheetOptions, Style, Column, CellValue, Row, Cell } from 'exceljs'

export interface ExcelOptions {
  _?: unknown
}

export interface ExcelAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<ExcelOptions> | ExcelOptions
  inject?: FactoryProvider['inject']
}

export interface DictOption {
  label: string
  value: string
}

export interface ExportOptions {
  /**
   * 导出的列key
   */
  include?: string[]
  /**
   * 排除的列key
   */
  exclude?: string[]
  /**
   * 字典数据
   */
  dictData?: Record<string, DictOption[]>
}

// https://github.com/exceljs/exceljs/blob/master/README_zh.md#添加工作表
export interface ExcelSheetOption extends Partial<AddWorksheetOptions> {
  /**
   * 工作表名称
   */
  name: string
  /**
   * 行默认高
   */
  rowHeight?: number
  /**
   * 行基础样式
   */
  rowStyle?: Partial<Style>
  /**
   * 列默认宽
   */
  colWidth?: number
  /**
   * 列基础样式，与具体列样式合并
   */
  colStyle?: Partial<Style>
  /**
   * 表头基础样式，与列样式合并
   */
  headerStyle?: Partial<Style>
}

// https://github.com/exceljs/exceljs/blob/master/README_zh.md#列
export interface ExcelColumnOption extends Partial<Column> {
  /**
   * 列名称
   */
  name: string
  /**
   * 列排序，根据数字正序
   */
  sort?: number
  /**
   * 列类型，根据类型默认转化复杂的操作
   */
  type?: 'link' | 'image'
  /**
   * type="link" 链接配置
   */
  linkOptions?: {
    tooltip?: string
  }
  /**
   * type="image" 图片配置
   */
  imageOptions?: {
    width?: number
    height?: number
    hyperlink?: boolean
  }
  /**
   * 字典类型，当 dictOptions 静态时可选
   */
  dictType?: string
  /**
   * 字典选项
   */
  dictOptions?: DictOption[]
  /**
   * 默认值，当值为空时使用此值
   */
  defaultValue?: CellValue
  /**
   * 列配置，当前列的每个单元格都会调用一次
   */
  cellConfig?(info: {
    row: Row
    cell: Cell
    rawRow: Record<string, any>
    rawCell: Record<string, any>
    rowIndex: number
    cellIndex: number
  }): void
  /**
   * 自定义字段
   */
  [index: string]: unknown
}
