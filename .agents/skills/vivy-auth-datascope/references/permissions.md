# 功能权限

在角色、权限码、按钮、菜单或路由问题中读取本文件。

## 当前语义

| 机制              | 当前来源与行为                                                                                                                                                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 后端角色/权限判断 | [AuthService](../../../../vivy-common/vivy-common-security/src/services/auth.service.ts) 从 SecurityContext 会话读取角色/权限                                                                                                                  |
| 装饰器逻辑        | [RequireRoles](../../../../vivy-common/vivy-common-security/src/decorators/require-roles.decorator.ts)、[RequirePermissions](../../../../vivy-common/vivy-common-security/src/decorators/require-permissions.decorator.ts) 默认 AND，可指定 OR |
| 授权数据          | [UserService](../../../../vivy-modules/vivy-system/src/modules/system/user/user.service.ts) 的 `getRolePermission`、`getMenuPermission`、`getRoleDataScope`                                                                                    |
| 启用的角色与菜单  | [RoleService](../../../../vivy-modules/vivy-system/src/modules/system/role/role.service.ts)、[MenuService](../../../../vivy-modules/vivy-system/src/modules/system/menu/menu.service.ts)                                                       |
| 前端访问谓词      | [access.ts](../../../../vivy-react/src/access.ts) 与 [类型声明](../../../../vivy-react/types/access.d.ts)                                                                                                                                      |

- `admin` 角色编码满足角色检查；`*:*:*` 权限编码满足权限码检查。两类判断各自使用对应集合。
- [UserConstants](../../../../vivy-common/vivy-common-core/src/constants/user.constants.ts) 中超级用户 ID、超级角色 ID 都为 1；[IdentityUtils](../../../../vivy-common/vivy-common-core/src/utils/security/identity.utils.ts) 分别判断用户和角色。不要混淆 ID、角色编码和权限编码。
- 同时添加 RequireRoles 与 RequirePermissions 时，守卫分别执行两类条件；各自的 OR 不是两类条件之间的 OR。
- 当前后端对空 AND/OR 数组都不会抛出权限异常；前端空 AND 为真、空 OR 为假，超级标识还有提前返回。新增访问控制不要用空数组表达拒绝，并核验实际数组语义。
- 普通字符串权限按精确匹配检查，仅超级权限编码具备当前实现中的全局放行意义。不要臆造通配符匹配规则。

## 操作路径的权限一致性

建立操作 → 接口 → 权限码 → 角色赋权 → 页面调用的对应关系。以 [岗位 Controller](../../../../vivy-modules/vivy-system/src/modules/system/post/post.controller.ts) 和 [页面](../../../../vivy-react/src/pages/system/post/index.tsx) 为普通范例。

- Controller 是功能权限执行点；前端 Access 控制交互展示，直接调用 API 仍须经后端检查。
- 使用精确的业务命名空间与操作后缀。已有数据中的大小写或别名按实际契约核对，不做全局自动规范化。
- `update` 按钮通常还会调用详情初始化的 `query` 接口；核验整个操作涉及的请求集合，而非只看按钮。
- 同步 `types/access.d.ts` 的权限/角色字面量，不把类型放宽为任意 string 或 `any` 来消除错误。

## 菜单与路由

当前路径：`MenuService.selectUserMenuTree` → `LoginService.getUserRouters` → 前端 [app.tsx](../../../../vivy-react/src/app.tsx) → [buildRoutes](../../../../vivy-react/src/router/helper/route.tsx)。

- `M` 目录、`C` 页面进入菜单/路由树；`F` 按钮承载操作权限。见 [SysMenu](../../../../vivy-modules/vivy-system/src/modules/system/menu/entities/sys-menu.entity.ts)。
- `status = '0'` 为启用；当前非超级用户菜单与权限查询过滤启用角色/菜单。
- `is_visible = '0'` 转为 `hideInMenu`，不等于删除路由或撤销后端权限。隐藏菜单可能仍被授权直接访问。
- 页面 `component` 必须对应实际 Umi 路由 ID，例如 `system/post/index`；错误映射会出现找不到页面，即使授权正确。
- 无菜单、无按钮权限、页面组件缺失、缓存陈旧是不同问题；根据链路定位，不能统一归因于权限码。

## 赋权数据

角色/菜单关系分别涉及 `sys_user_role`、`sys_role_menu`；自定义数据范围还涉及 `sys_role_dept`。参考 [初始化 SQL](../../../../sql/vivy-nest-admin.sql) 并按目标环境的数据确定关联，使用明确列名。

新增能力依据要求授给对应角色，不默认为所有角色开放。权限修复的目标是恢复所需访问边界，而不是隐藏按钮或绕过失败请求。
