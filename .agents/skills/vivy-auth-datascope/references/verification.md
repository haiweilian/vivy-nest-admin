# 权限验证与交付

在新增访问控制、修复越权或调整角色/数据范围后读取本文件。按本次改变的链路选择验证，不要求每次运行全部矩阵。

## 项目测试入口

- 单元测试使用 [Vitest 配置](../../../../vitest.config.ts)、`@nestjs/testing`、SWC 和 [setup.ts](../../../../test/setup.ts)。相关已有范例为 [AuthService 测试](../../../../vivy-common/vivy-common-security/src/services/auth.service.spec.ts)。
- HTTP 测试使用 [E2E 配置](../../../../vitest.config.e2e.ts) 和 Supertest，现有 [系统冒烟测试](../../../../vivy-modules/vivy-system/test/app.e2e-spec.ts) 仅装配隔离的 Controller/Service。
- 隔离 TestingModule 默认不代表装配了项目全局守卫、DataScopeInterceptor、ValidationPipe 和异常过滤器；需要验证它们时显式纳入测试配置。
- 构建公共包后定向运行相关 Vitest 文件。需要数据库/Redis 的集成测试使用独立测试环境与数据清理，不能用线上数据做权限变更实验。

## 按改动选择行为

| 改动       | 应能区分的允许/拒绝路径                                                            |
| ---------- | ---------------------------------------------------------------------------------- |
| 认证       | 正常会话；缺少 Token；JWT 无效/过期；JWT 有效但 Redis 会话已删除                   |
| 角色与权限 | 权限齐全；缺少一项；AND/OR；同时配置角色和权限；超级标识及普通用户                 |
| 菜单与按钮 | 已授权页面；隐藏但仍授权的页面；禁用菜单/角色；组件路径错误；直接调用 API          |
| 范围过滤   | ALL、CUSTOM、DEPT、DEPT_AND_CHILD、SELF；多角色组合；超级用户与普通 admin 角色用户 |
| ID 操作    | 范围内与范围外的详情、更新、删除；有功能权限但目标不在范围；批量混合 ID            |
| 归属修改   | 创建/更新的目标部门或用户是否允许；客户端伪造归属不会取得额外范围                  |
| 上下文     | 连续或并发请求的用户身份相互隔离，任务外调用不读取另一请求的用户                   |

## 验证重点

- 用两个不同范围的普通用户与不同归属记录测试，避免只使用 ID=1 的超级用户。
- 数据范围验证可访问记录集、分页/计数/导出和数据库副作用。只匹配 SQL 字符串不能证明别名、AND/OR 或 ID 校验正确。
- 被拒绝的写操作断言没有 update/delete/关联写入；批量操作检查结果协议和原子性。
- 缺元数据、空 scopes、未知范围、SELF 缺别名按任务中的明确策略验证；不要因 SQL 错误而改成全量放行。
- 涉及空权限数组或重复项时核验前后端实际语义；不要把参考文档描述替代运行行为。

## HTTP 与业务错误

注册 [ServiceExceptionFilter](../../../../vivy-common/vivy-common-core/src/exceptions-filters/service.filter.ts) 的应用可能用 HTTP 200 返回 `AjaxResult` 错误；认证失败检查 `body.code === 401`，功能权限失败检查 `body.code === 403`。仅 `.expect(200)` 可能同时通过允许和拒绝请求。

数据范围拒绝的错误码由实际业务异常决定，不统一等于 403。例如当前 [UserService.checkUserDataScope](../../../../vivy-modules/vivy-system/src/modules/system/user/user.service.ts) 抛出普通 ServiceException，默认 `body.code` 为 400；同时断言目标不可访问且没有写入副作用。

未装配该过滤器的隔离测试按其实际 HTTP 协议检查，避免把测试装配差异误判为业务回归。

## 交付说明

说明修改了哪条身份/权限/范围链路、哪些访问允许或拒绝、完成的验证及环境限制。源码检查、mock 测试、真实 HTTP 和数据库集成验证分别据实描述，不夸大验证范围。
