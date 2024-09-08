/**
 * 业务状态
 * @description 表示目前有两个状态的通用枚举(状态是可扩展的)
 */
export enum BaseStatusEnum {
  /**
   * 正常/成功
   */
  NORMAL = '0',

  /**
   * 停用/失败
   */
  DISABLE = '1',

  /**
   * 扩展字段
   */
  // ARCHIVE = '2',
}
