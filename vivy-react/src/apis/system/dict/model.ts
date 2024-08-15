/**
 * 字典类型
 */
export interface DictTypeModel {
  /** 字典ID */
  dictId: number

  /** 字典名称 */
  dictName: string

  /** 字典类型 */
  dictType: string

  /** 显示顺序 */
  dictSort: number

  /** 字典状态（0正常 1停用） */
  status: string
}

/**
 * 查询字典类型
 */
export interface ListDictTypeParams extends PaginateParams {
  /** 字典名称 */
  dictName?: string

  /** 字典类型 */
  dictType?: string

  /** 字典状态（0正常 1停用） */
  status?: string
}

/**
 * 添加字典类型
 */
export type CreateDictTypeParams = Omit<DictTypeModel, 'dictId'>

/**
 * 更新字典类型
 */
export type UpdateDictTypeParams = Omit<DictTypeModel, 'dictId'>

/**
 * 字典数据
 */
export interface DictDataModel {
  /** 字典ID */
  dictId: number

  /** 字典类型 */
  dictType: string

  /** 字典标签 */
  dictLabel: string

  /** 字典键值 */
  dictValue: string

  /** 显示顺序 */
  dictSort: number

  /** 字典状态（0正常 1停用） */
  status: string

  /** 样式属性（其他样式扩展） */
  cssClass?: string

  /** 表格回显样式 */
  listClass?: string
}

/**
 * 查询字典数据
 */
export interface ListDictDataParams extends PaginateParams {
  /** 字典类型 */
  dictType?: string

  /** 字典标签 */
  dictLabel?: string

  /** 字典状态（0正常 1停用） */
  status?: string
}

/**
 * 添加字典数据
 */
export type CreateDictDataParams = Omit<DictDataModel, 'dictId'>

/**
 * 更新字典数据
 */
export type UpdateDictDataParams = Omit<DictDataModel, 'dictId'>
