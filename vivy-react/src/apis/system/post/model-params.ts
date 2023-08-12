/**
 * 查询岗位
 */
export interface ListPostParams extends PaginateParams {
  /** 岗位名称 */
  postName?: string

  /** 岗位编码 */
  postCode?: string

  /** 岗位状态（0正常 1停用） */
  status?: string
}

/**
 * 添加岗位
 */
export interface CreatePostParams {
  /** 岗位名称 */
  postName: string

  /** 岗位编码 */
  postCode: string

  /** 显示顺序 */
  postSort?: number

  /** 岗位状态（0正常 1停用） */
  status?: string
}

/**
 * 更新岗位
 */
export interface UpdatePostParams extends CreatePostParams {
  /** 岗位ID */
  postId: number
}
