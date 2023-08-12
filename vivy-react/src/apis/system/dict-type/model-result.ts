/**
 * 字典类型
 */
export interface DictTypeResult {
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
