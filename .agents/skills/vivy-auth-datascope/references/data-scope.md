# 数据范围

在按部门/本人过滤，或详情、导出、写操作存在越权风险时读取本文件。

## 先读实际实现

- [DataScopeService](../../../../vivy-common/vivy-common-datascope/src/datascope.service.ts)：范围 SQL 的生成。
- [DataScope](../../../../vivy-common/vivy-common-datascope/src/decorators/datascope.decorator.ts)、[DataScopeInterceptor](../../../../vivy-common/vivy-common-datascope/src/datascope.interceptor.ts)、[DataScopeSql](../../../../vivy-common/vivy-common-datascope/src/decorators/datascope-sql.decorator.ts)：方法元数据及 Controller 参数传递。
- [用户 Service](../../../../vivy-modules/vivy-system/src/modules/system/user/user.service.ts) 的 `dsUserQueryBuilder`、`checkUserDataScope`、`export`：范围查询复用与目标校验。
- [角色 Service](../../../../vivy-modules/vivy-system/src/modules/system/role/role.service.ts)、[部门 Service](../../../../vivy-modules/vivy-system/src/modules/system/dept/dept.service.ts)：不同关联与表别名的范例。

## 角色范围语义

以 [DataScopeType](../../../../vivy-common/vivy-common-datascope/src/datascope.enum.ts) 为准，当前值为字符串：

| 类型         | 值    | 约束来源                             |
| ------------ | ----- | ------------------------------------ |
| 全部         | `'1'` | 不限制范围                           |
| 自定义       | `'2'` | `sys_role_dept` 中该角色的部门       |
| 本部门       | `'3'` | 登录用户的 `sysUser.deptId`          |
| 本部门及下级 | `'4'` | `sys_dept` 的部门及 `ancestors` 关系 |
| 仅本人       | `'5'` | 登录用户的 `sysUser.userId`          |

当前多个角色的范围用 OR 合并，含 ALL 的组合放行全部；超级用户 ID 为 1 的用户直接返回不限制范围条件。拥有 `admin` 角色编码的其他用户不因此自动获得 ID=1 的数据范围旁路。

## 表别名与上下文

- `deptAlias` 指向包含 `dept_id` 的实际表别名；`userAlias` 指向包含 `user_id` 的实际表别名。它们不是可配置的任意字段名。
- 业务表已有 `dept_id`、`user_id` 时可使用同一个业务别名；其他归属模型先明确字段与关联映射，不能把 `create_by`、`owner_id` 或创建者用户名假装成 `user_id`。
- DataScopeService 从 SecurityContext 的当前登录会话取范围，不能使用请求传来的用户 ID、部门或自拼 SQL 代替授权上下文。
- 仅为业务明确需要的数据范围配置归属字段；普通 CRUD 不自动新增部门/用户字段。

## 让范围实际进入操作

优先参考项目的受约束 QueryBuilder 工厂，带上正确的 `@DataScope` 元数据，并调用 `dataScopeService.sql(this.<实际方法>)`。直接传入方法引用保留元数据；换成匿名包装或 bind 后需核验是否仍能取得元数据。

- 在 Service/查询工厂上添加装饰器后，仍须将返回的 SQL 条件加入查询。独立的 `findOneBy`、`update`、`delete` 不会自动获得该条件。
- Controller 方式依赖已注册的 DataScopeInterceptor，需把 `@DataScopeSql()` 的结果传入下层并实际使用。
- 范围条件与业务筛选用 AND 组合；业务 OR 条件放在 Brackets 等分组中，避免 OR 绕过范围。范围不能被后续 `.where()` 覆盖。
- 列表、统计、选项、详情与导出按各自的数据范围要求复用受约束的查询，不只保护列表。
- 详情/更新/删除以“目标 ID ∩ 当前允许范围”查找或校验。功能权限通过仍需范围校验；不能只根据实体的存在性判定可操作。
- 创建时从服务端确定需要的归属；允许选择目标部门/用户时检查选择权限。更新归属时同时验证原目标与新归属，不只检查原记录可见。
- 批量写操作校验全部目标，按要求实现全成全败或明确的部分成功协议。需要事务时使用同一 manager 完成读取、关联校验和写入；并发要求高的操作按需要增加锁或带范围的写入条件。

## 当前边界须验证

以下是当前实现细节，不是对所有业务的默认策略：

- 用方法引用取不到 DataScope 元数据时，返回 `1 = 1`；方法存在装饰器不能证明调用方式一定取得了它。
- 非超级用户的 `scopes` 为空或全是未知范围值时，当前拼接可能得到 `()`；不能把它解释为可靠拒绝，也不能用“SQL 出错时返回全部”兜底。
- SELF 缺少 `userAlias` 时使用 `deptAlias.dept_id = 0`；如果业务实际有部门 0 的记录，需要验证其行为，不宣称必定空结果。
- ALL 和多角色组合需验证可访问结果，而非只要求某一种 SQL 文本格式。

任务要求处理这些边界时，明确拒绝、空结果或业务默认策略，并用真实结果与副作用验证。不要为没有配置范围的无关业务整体改写公共规则。

## XML 的使用边界

范围过滤通常可直接用于 QueryBuilder。只有任务明确需要 XML 时才把服务端生成的范围片段传入已选定的 Mapper SQL；`${}` 不接收请求构造的 SQL。核验 namespace/id、表别名、条件分组与实际数据访问路径，不能因引入 XML 就认为范围已生效。
