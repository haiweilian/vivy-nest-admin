import 'reflect-metadata'
import { SetMetadata } from '@nestjs/common'
import { EXCEL_SHEET_METADATA, EXCEL_COLUMN_METADATA } from './excel.constants'
import { ExcelSheetOption, ExcelColumnOption } from './excel.interface'

/**
 * 表格工作表装饰器
 * @param options 工作表配置
 * @returns ClassDecorator
 */
export const ExcelSheet = (options: ExcelSheetOption) => {
  return SetMetadata(EXCEL_SHEET_METADATA, options)
}

/**
 * 表格列装饰器
 * @param options 列配置
 * @returns PropertyDecorator
 */
export const ExcelColumn = (options: ExcelColumnOption): PropertyDecorator => {
  return (target: object, key: string) => {
    const value = Object.assign(options, {
      key: options.key || key,
      header: options.header || options.name,
    })
    const prevValue = Reflect.getMetadata(EXCEL_COLUMN_METADATA, target.constructor) || []
    const nextValue = [...prevValue, value]
    Reflect.defineMetadata(EXCEL_COLUMN_METADATA, nextValue, target.constructor)
  }
}
