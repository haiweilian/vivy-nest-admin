/**
 * 数据范围权限类型
 */
export enum DataScopeType {
  /**
   * 全部数据权限
   */
  ALL = '1',

  /**
   * 自定数据权限
   */
  CUSTOM = '2',

  /**
   * 部门数据权限
   */
  DEPT = '3',

  /**
   * 部门及以下数据权限
   */
  DEPT_AND_CHILD = '4',

  /**
   * 仅本人数据权限
   */
  SELF = '5',
}
