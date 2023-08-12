/**
 * 基础时间实体
 */
declare interface BaseTimeEntity {
  /** 创建时间 */
  createTime: string

  /** 更新时间 */
  updateTime: string
}

/**
 * 基础业务实体
 */
declare interface BaseBusinessEntity {
  /** 备注 */
  remark?: string

  /** 创建者 */
  createBy?: string

  /** 创建时间 */
  createTime: string

  /** 更新者 */
  updateBy?: string

  /** 更新时间 */
  updateTime: string
}
