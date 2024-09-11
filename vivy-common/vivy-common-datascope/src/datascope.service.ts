import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SecurityContext, IdentityUtils, SysLoginUser } from '@vivy-common/core'
import { DATA_SCOPE_METADATA } from './datascope.constants'
import { DataScopeType } from './datascope.enum'
import { TableAlias } from './datascope.interface'

@Injectable()
export class DataScopeService {
  constructor(
    private reflector: Reflector,
    private securityContext: SecurityContext
  ) {}

  /**
   * 不判断 SQL 是否为空，安全的使用 WHERE 语句
   */
  private readonly SAFE_WHERE = '1 = 1'

  /**
   * 获取数据权限 SQL
   * @param tableAlias 别名配置
   */
  sql(tableAlias: TableAlias | Function) {
    const user = this.securityContext.getLoginUser()
    if (typeof tableAlias === 'function') {
      tableAlias = this.reflector.get<TableAlias>(DATA_SCOPE_METADATA, tableAlias)
    }

    const isAdmin = IdentityUtils.isAdmin(user.userId)
    if (isAdmin) return this.SAFE_WHERE

    return this.dataScopeFilter(user, tableAlias)
  }

  /**
   * 数据范围过滤
   * @param user 用户
   * @param alias 别名配置
   */
  private dataScopeFilter(user: SysLoginUser, alias: TableAlias) {
    let sql = ''

    const { userId, deptId = 0 } = user.sysUser
    const { deptAlias, userAlias } = alias
    for (const { roleId, dataScope } of user.scopes) {
      if (dataScope === DataScopeType.ALL) {
        // 1.全部数据权限：不限制查询条件
        sql = this.SAFE_WHERE
      } else if (dataScope === DataScopeType.CUSTOM) {
        // 2.自定数据权限：从 `sys_role_dept` 表中查出角色分配的部门，再通过 `IN` 查找多个部门的数据
        sql += ` OR ${deptAlias}.dept_id IN(SELECT dept_id FROM sys_role_dept WHERE role_id = ${roleId})`
      } else if (dataScope === DataScopeType.DEPT) {
        // 3.部门数据权限：根据 `dept_id` 查询本部门的数据
        sql += ` OR ${deptAlias}.dept_id = ${deptId}`
      } else if (dataScope === DataScopeType.DEPT_AND_CHILD) {
        // 4.部门及以下数据权限：从 `sys_dept` 表中查出本部门和子部门，再通过 `IN` 查找多个部门的数据
        sql += ` OR ${deptAlias}.dept_id IN(SELECT dept_id FROM sys_dept WHERE dept_id = ${deptId} OR FIND_IN_SET(${deptId}, ancestors))`
      } else if (dataScope === DataScopeType.SELF) {
        if (userAlias) {
          // 5.仅本人数据权限：根据 `user_id` 查询本人的数据
          sql += ` OR ${userAlias}.user_id = ${userId}`
        } else {
          // 数据权限为仅本人且没有 `userAlias` 别名不查询任何数据
          sql += ` OR ${userAlias}.dept_id = 0`
        }
      }
    }

    return `(${sql.slice(4)})`
  }
}
