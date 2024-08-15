/**
 * 代码生成表
 */
export interface GenTableModel {
  /** 编号 */
  tableId: number

  /** 表名称 */
  tableName: string

  /** 表描述 */
  tableComment: string

  /** 关联子表的表名 */
  subTableName?: string

  /** 子表关联的外键名 */
  subTableFkName?: string

  /** 实体类名称 */
  className: string

  /** 生成模板分类 */
  templateCategory: string

  /** 生成业务名 */
  businessName: string

  /** 生成功能名 */
  functionName: string

  /** 生成功能作者 */
  functionAuthor: string

  /** 生成表列字段 */
  columns: GenTableColumnModel[]
}

/**
 * 代码生成表字段
 */
export interface GenTableColumnModel {
  /** 编号 */
  columnId: number

  /** 归属表编号 */
  tableId: number

  /** 列名称 */
  columnName: string

  /** 列类型 */
  columnType: string

  /** 列顺序 */
  columnSort: number

  /** 列描述 */
  columnComment: string

  /** 是否主键（0否 1是） */
  isPk?: string

  /** 是否自增（0否 1是） */
  isIncrement?: string

  /** 是否必填（0否 1是） */
  isRequired?: string

  /** 是否为插入字段（0否 1是） */
  isInsert?: string

  /** 是否编辑字段（0否 1是） */
  isEdit?: string

  /** 是否列表字段（0否 1是） */
  isList?: string

  /** 是否查询字段（0否 1是） */
  isQuery?: string

  /** 属性名称 */
  fieldName: string

  /** TS类型 */
  tslangType: string

  /** JAVA类型 */
  javalangType: string

  /** 查询方式（等于、不等于、大于、小于、范围） */
  queryType: string

  /** 显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件） */
  htmlType: string

  /** 字典类型 */
  dictType?: string
}

/**
 * 查询代码生成
 */
export interface ListGenParams extends PaginateParams {
  /** 表名称 */
  tableName?: string

  /** 表注释 */
  tableComment?: string
}

/**
 * 更新代码生成
 */
export type UpdateGenParams = GenTableModel

/**
 * 生成预览
 */
export interface GenPreviewResult {
  /** 分类名称 */
  name: string

  /** 文件列表 */
  files: Array<{
    /** 文件名称 */
    name: string

    /** 文件代码 */
    code: string
  }>
}
