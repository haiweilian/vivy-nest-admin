/**
 * 缓存信息
 */
export interface CacheResult {
  /** 缓存名称 */
  name: string

  /** 缓存键名 */
  key: string

  /** 缓存内容 */
  value: string

  /** 缓存备注 */
  remark: string
}
