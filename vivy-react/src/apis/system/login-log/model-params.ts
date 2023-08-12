/**
 * 查询登录日志
 */
export interface ListLoginLogParams extends PaginateParams {
  /** 用户账号 */
  loginName?: string

  /** 登录状态 */
  loginStatus?: number

  /** 登录时间 */
  createTime?: string[]
}
