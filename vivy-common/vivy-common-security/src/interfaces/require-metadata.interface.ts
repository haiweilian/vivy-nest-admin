import { Logical } from '../enums/logical.enums'

export interface RequireMetadata {
  /**
   * 需要校验的标识
   */
  value: string[]

  /**
   * 验证逻辑：AND | OR，默认AND
   */
  logical: Logical
}
