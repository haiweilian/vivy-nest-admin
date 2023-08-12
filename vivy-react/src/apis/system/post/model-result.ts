/**
 * 岗位信息
 */
export interface PostResult {
  /** 岗位ID */
  postId: number

  /** 岗位名称 */
  postName: string

  /** 岗位编码 */
  postCode: string

  /** 显示顺序 */
  postSort: number

  /** 岗位状态（0正常 1停用） */
  status: string
}
