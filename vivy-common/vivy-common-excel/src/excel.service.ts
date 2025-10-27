import { Injectable, Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import axios from 'axios'
import * as ExcelJS from 'exceljs'
import { merge, cloneDeep, isString, isFunction } from 'lodash'
import { EXCEL_SHEET_METADATA, EXCEL_COLUMN_METADATA } from './excel.constants'
import { ExcelSheetOption, ExcelColumnOption, ExportOptions } from './excel.interface'

interface SheetImage extends ExcelJS.ImagePosition {
  url: string
  hyperlinks?: ExcelJS.ImageHyperlinkValue
}

@Injectable()
export class ExcelService {
  constructor(private reflector: Reflector) {}

  /**
   * 创建实例
   * @param model 实体
   * @param rows 数据
   * @param options 配置
   */
  async create<Model, TModel extends Type<Model>>(model: TModel, rows: Model[], options?: ExportOptions) {
    const workbook = new ExcelJS.Workbook()
    workbook.created = new Date()
    workbook.modified = new Date()

    const sheet = this.reflector.get<ExcelSheetOption>(EXCEL_SHEET_METADATA, model)
    const worksheet = workbook.addWorksheet(sheet.name, sheet)
    const sheetImages: SheetImage[] = []

    const columns = this.reflector.get<ExcelColumnOption[]>(EXCEL_COLUMN_METADATA, model)
    const rawRows = cloneDeep(rows)
    const rawCols = this.formatColumns(cloneDeep(columns), options)
    rawCols.forEach((col) => {
      col.width = sheet.colWidth
    })
    worksheet.columns = rawCols

    worksheet.addRows(rawRows)
    worksheet.eachRow((row, rowIndex) => {
      row.height = row.height || sheet.rowHeight
      this.mergeStyle(row, sheet.rowStyle)

      row.eachCell((cell, cellIndex) => {
        const rawRow = rawRows[rowIndex - 1]
        const rawCell = rawCols[cellIndex - 1]

        cell.style = this.mergeStyle(sheet.colStyle, cell.style)
        if (rowIndex === 1) {
          cell.style = this.mergeStyle(cell.style, sheet.headerStyle)
          return
        }

        if (rawCell.type === 'link') {
          this.transformLink(cell, rawCell)
        }

        if (rawCell.type === 'image') {
          const value = this.transformImage(row, cell, rawCell)
          value && sheetImages.push(value)
        }

        if (rawCell.dictType || rawCell.dictOptions) {
          this.transformDictLabel(cell, rawCell, options)
        }

        if (rawCell.defaultValue != null) {
          cell.value = cell.value != null ? cell.value : rawCell.defaultValue
        }

        if (isFunction(rawCell.cellConfig)) {
          rawCell.cellConfig({
            row,
            cell,
            rawRow,
            rawCell,
            rowIndex,
            cellIndex,
          })
        }
      })
    })

    const buffers = await Promise.all(
      sheetImages.map((image) =>
        axios.get<ArrayBuffer>(image.url, { responseType: 'arraybuffer' }).then(({ data }) => data)
      )
    )
    sheetImages.forEach((image, index) => {
      const id = workbook.addImage({
        buffer: buffers[index],
        extension: 'png',
      })
      worksheet.addImage(id, image)
    })

    return {
      workbook,
      worksheet,
    }
  }

  /**
   * 导出表格
   * @param model 实体
   * @param rows 数据
   * @param options 配置
   */
  async export<Model, TModel extends Type<Model>>(model: TModel, rows: Model[], options?: ExportOptions) {
    const { workbook } = await this.create(model, rows, options)
    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
  }

  /**
   * 导出模板
   * @param model 实体
   * @param options 配置
   */
  async exportTemplate<TModel extends Type<any>>(model: TModel, options?: ExportOptions) {
    const { workbook } = await this.create(model, [], options)
    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
  }

  /**
   * 导入数据
   * @param model 实体
   * @param options 配置
   */
  async import<TModel>(model: Type<TModel>, buffer: ExcelJS.Buffer, options?: ExportOptions) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.getWorksheet(1)
    const rows = worksheet.getSheetValues() as unknown as (number | string)[]
    const rowValues = rows.slice(2)

    const cols = this.reflector.get<ExcelColumnOption[]>(EXCEL_COLUMN_METADATA, model)
    const colValues = this.formatColumns(cols, options)

    const data: TModel[] = []
    rowValues.forEach((row) => {
      const item = new model()
      colValues.forEach((col, colIndex) => {
        if (col.dictType || col.dictOptions) {
          item[col.key] = this.transformDictValue(row[colIndex + 1], col, options)
        } else {
          item[col.key] = row[colIndex + 1]
        }
      })
      data.push(item)
    })

    return data
  }

  /**
   * 合并样式
   */
  private mergeStyle<T = Partial<ExcelJS.Style>>(object: T, ...source: T[]): T {
    return merge({}, object, ...source)
  }

  /**
   * 格式化列
   */
  private formatColumns(columns: ExcelColumnOption[], options?: ExportOptions) {
    return columns
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .filter((column) => (options?.include ? options?.include.includes(column.key) : true))
      .filter((column) => (options?.exclude ? !options?.exclude.includes(column.key) : true))
  }

  /**
   * 转换链接类型
   */
  private transformLink(cell: ExcelJS.Cell, rawCell: ExcelColumnOption) {
    cell.value = {
      text: cell.text,
      hyperlink: cell.text,
      tooltip: cell.text,
      ...(rawCell.linkOptions || {}),
    }
    cell.style = this.mergeStyle(cell.style, {
      font: {
        underline: 'single',
        color: { argb: '0000EE' },
      },
    })
  }

  /**
   * 转换图片内容
   */
  private transformImage(row: ExcelJS.Row, cell: ExcelJS.Cell, rawCell: ExcelColumnOption): SheetImage {
    const value = cell.value
    if (!value || !isString(value) || !/^http(s)?:\/\//.test(value)) return
    cell.value = null

    return {
      tl: {
        col: Number(cell.col) - 1,
        row: Number(cell.row) - 1,
      },
      ext: {
        width: rawCell.imageOptions?.width || row.height,
        height: rawCell.imageOptions?.height || row.height,
      },
      url: value,
      hyperlinks: rawCell.imageOptions?.hyperlink
        ? {
            hyperlink: value,
            tooltip: value,
          }
        : undefined,
    }
  }

  /**
   * 转换字典标签
   */
  private transformDictLabel(cell: ExcelJS.Cell, rawCell: ExcelColumnOption, options?: ExportOptions) {
    const list = rawCell.dictOptions || options?.dictData?.[rawCell.dictType]
    const option = list?.find((item) => item.value === cell.value)
    cell.value = option?.label || cell.value
  }

  /**
   * 转换字典标签值
   */
  private transformDictValue(label: string, rawCell: ExcelColumnOption, options?: ExportOptions) {
    const list = rawCell.dictOptions || options?.dictData?.[rawCell.dictType]
    const option = list?.find((item) => item.label === label)
    return option?.value || label
  }
}
