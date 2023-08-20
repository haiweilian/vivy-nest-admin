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
export type UpdateDictTypeParams = DictTypeModel
