# 项目接入

在完整业务接入，或需要模块、菜单、权限、SQL 与跨层类型同步时读取本文件。按本次任务范围处理相关部分。

## 后端模块

以 [PostModule](../../../../vivy-modules/vivy-system/src/modules/system/post/post.module.ts) 和 [SystemModule](../../../../vivy-modules/vivy-system/src/modules/system/system.module.ts) 为普通系统业务范例；其他业务放入其实际父模块。

- 注册 Controller、Service、Repository 所需实体和真实依赖，检查跨模块 imports/exports。
- 新模块加入父模块；复用已有模块时在原位置增量修改。
- 本地导入使用后端 NodeNext 所需的 `.js` 扩展名。依赖注入所需类保留运行时导入。
- 只有使用新的运行时资源时才检查或调整 assets 配置；普通 Repository CRUD 不新增 XML 资源。

## 操作与权限码

为实际实现的操作建立对应关系，命名空间遵循目标业务：

| 业务操作         | 常见接口                 | 权限后缀 |
| ---------------- | ------------------------ | -------- |
| 列表             | `GET /resources`         | `list`   |
| 详情或编辑初始化 | `GET /resources/:id`     | `query`  |
| 新增             | `POST /resources`        | `add`    |
| 更新             | `PUT /resources/:id`     | `update` |
| 删除             | `DELETE /resources/:ids` | `delete` |

例如现有岗位使用 `system:post:update`。旧业务的命名可能不同，比较真实字符串而非自动改写大小写。

- 对应 Controller 操作使用 `@RequirePermissions`；固定角色限制仅在业务确有要求时添加 `@RequireRoles`。
- 写操作按现有范例接入 `@Log({ title, operType })`，选择对应的 INSERT、UPDATE 或 DELETE 类型。
- 前端 `hasPermission`、菜单 `permission`、后端装饰器和 `vivy-react/types/access.d.ts` 一致。添加新字面量时保持已有类型约束。
- 用户实际交互的所有请求都需符合赋权范围，例如编辑按钮可见后，详情初始化接口仍可能缺少 `query` 权限。
- 角色赋权或数据范围实现涉及 [权限技能](../../vivy-auth-datascope/SKILL.md) 时，按需读取相关模块；普通 CRUD 不自动重构认证链路。

## 菜单与动态路由

当前流程：数据库菜单 → `LoginService.getUserRouters` → Umi `buildRoutes` → 页面组件映射。参考 [菜单实体](../../../../vivy-modules/vivy-system/src/modules/system/menu/entities/sys-menu.entity.ts)、[路由构建](../../../../vivy-react/src/router/helper/route.tsx) 和 [初始化 SQL](../../../../sql/mysql/vivy-nest-admin.sql)。

- `menu_type` 为 `M` 目录、`C` 页面、`F` 按钮；页面和按钮配置各自承担不同职责。
- `component` 使用实际页面的 Umi 映射 ID，例如 `system/post/index`，与 `src/pages/system/post/index.tsx` 对应；不填写 `.tsx` 后缀或 `@/pages` 导入路径。
- `path` 与父目录、参数路由组合保持一致。确认 Umi 生成的路由 ID 真正能映射新页面。
- `status` 的 `'0'` 表示启用；`is_visible` 的 `'0'` 表示隐藏，隐藏不是撤销接口权限。
- 新功能的菜单、按钮和角色关联依据业务赋权要求提供；不默认给所有角色授予新增权限。

## SQL 与实际环境

- 表不存在且任务要求新业务时，按实体提供建表 SQL；已有表变化提供对应增量 SQL。需要新菜单、字典或角色关联时提供相应 SQL 工件。
- 初始化脚本用于新安装，已有环境升级使用增量脚本；不将整份初始化脚本作为一次 CRUD 变更的升级操作。
- 菜单/角色 ID 依据目标数据分配或查询，SQL 使用明确列名，避免复制范例的固定 ID 和位置参数。
- SQL、实体、DTO 与前端类型保持一致。源码或 SQL 工件只能证明设计，不能证明真实数据库已更新。
- 实际执行数据库变更按当前任务已有的授权与环境信息进行；缺少运行环境时仍完成可审查的代码和 SQL，并明确尚未执行的部分。

## 接入确认

核验新模块可被加载、API 与类型匹配、页面能路由到、按钮和所有操作请求的权限一致、关联选择有可用数据源。需要数据范围的业务，核验详情、导出和写入路径没有绕过范围查询。
