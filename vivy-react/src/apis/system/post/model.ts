/**
 * 岗位信息
 */
export interface PostModel {
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
export type CreatePostParams = Omit<PostModel, 'postId'>

/**
 * 更新岗位
 */
export type UpdatePostParams = PostModel
