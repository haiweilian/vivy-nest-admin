interface ObjectLiteral {
  [s: string]: any
}

interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number
  /**
   * the total amount of items
   */
  totalItems?: number
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number
  /**
   * the total amount of pages in this paginator
   */
  totalPages?: number
  /**
   * the current page this paginator "points" to
   */
  currentPage: number
}

interface IPaginationLinks {
  /**
   * a link to the "first" page
   */
  first?: string
  /**
   * a link to the "previous" page
   */
  previous?: string
  /**
   * a link to the "next" page
   */
  next?: string
  /**
   * a link to the "last" page
   */
  last?: string
}

/**
 * 分页响应对象
 */
declare interface Pagination<PaginationObject, T extends ObjectLiteral = IPaginationMeta> {
  /**
   * a list of items to be returned
   */
  readonly items: PaginationObject[]
  /**
   * associated meta information (e.g., counts)
   */
  readonly meta: T
  /**
   * associated links
   */
  readonly links?: IPaginationLinks
}

/**
 * 分页基础参数
 */
declare interface PaginateParams {
  /**
   * 当前页数
   */
  readonly page?: number

  /**
   * 当前页数量
   */
  readonly limit?: number
}
