# Vivy Nest Admin 开发约定

本文件适用于整个仓库。开始修改前，先阅读目标目录的代码、配置和相关文档；具体实现以当前源码与 `package.json` 为准。

## 项目结构

本项目使用 pnpm workspace 管理 NestJS + React 后台系统。

| 目录                         | 职责                                                 |
| ---------------------------- | ---------------------------------------------------- |
| `vivy-modules/vivy-system`   | NestJS 系统业务、认证、文件、任务调度和代码生成      |
| `vivy-modules/vivy-ai`       | AI 业务独立服务，PostgreSQL 存储，共享系统登录态     |
| `vivy-modules/vivy-template` | 独立 NestJS 应用模板                                 |
| `vivy-common/vivy-common-*`  | 核心、安全、数据权限、日志、Excel 和 Swagger 公共包  |
| `vivy-common/vivy-plugin-*`  | 自研配置加载和 MyBatis 插件                          |
| `vivy-react`                 | React、Umi Max、Ant Design 和 ProComponents 前端     |
| `internal`                   | 共享 ESLint、Stylelint 配置                          |
| `docs`                       | VitePress 文档                                       |
| `sql`、`docker`              | 数据库初始化与本地基础服务配置                       |

## 项目技能

技能安装在 `.agents/skills`，按任务需要读取对应的 `SKILL.md` 及其引用文件。

| 技能                          | 适用任务                                                       | 入口                                                            |
| ----------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- |
| `vivy-fullstack-crud`         | 新建或修改后台业务 CRUD，按需求完成后端、前端及项目接入        | [SKILL.md](.agents/skills/vivy-fullstack-crud/SKILL.md)         |
| `vivy-auth-datascope`         | 登录认证、角色/权限码、菜单与业务数据范围                      | [SKILL.md](.agents/skills/vivy-auth-datascope/SKILL.md)         |
| `nestjs-best-practices`       | 编写、审查或重构 NestJS 模块、依赖注入、接口、数据库和认证代码 | [SKILL.md](.agents/skills/nestjs-best-practices/SKILL.md)       |
| `vercel-react-best-practices` | 编写、审查或优化 React 组件、请求、渲染和包体积                | [SKILL.md](.agents/skills/vercel-react-best-practices/SKILL.md) |
| `web-design-guidelines`       | UI 审查、可访问性、表单交互和用户体验检查                      | [SKILL.md](.agents/skills/web-design-guidelines/SKILL.md)       |

- 技能中的通用示例需适配本仓库已有的架构、公共包和接口约定。
- React 性能建议按 Umi Max、`useRequest`、`useModel` 和现有路由机制落地。Next.js、RSC、Server Actions 专用规则仅在实际使用相应功能时适用。
- UI 审查使用 `web-design-guidelines` 自带的 `references/command.md`，并基于具体文件给出问题位置。
- 第三方技能保留上游结构；项目适配约定在本文件维护。新增项目技能时更新上表。
- 项目技能按任务选择参考模块；普通 CRUD 的权限码接入无需展开全套权限审计。新增 Mapper/XML 仅用于明确需要 XML 的任务，连表或数据范围本身不自动启用 XML。

## 编码约定

- 使用 pnpm 管理依赖和运行脚本；新增依赖放入实际使用它的 workspace 包。
- 优先复用已有模块、组件和公共工具，按业务边界组织改动。
- 遵循 `.prettierrc.js`、`eslint.config.js` 和共享 lint 配置：单引号、无分号、ES5 尾逗号、120 列行宽。
- 修改接口时同步 DTO、实体、前端 API 类型、调用页面和相关文档。
- 提交信息遵循 Conventional Commits；可使用 `pnpm commit`。

### 与既有风格保持一致

新建模块先选一个最接近的现有模块作为模板（岗位管理、参数配置、通知公告、定时任务），先对齐目录结构、命名、注释、响应格式和页面交互，再处理业务差异。不要凭通用经验重写一套等价实现。

以下偏离需要先确认，或在交付说明中逐条写明原因与影响：

- 新增依赖、公共组件、基类、装饰器、中间件，或新的目录层级。
- 与相邻模块不同的接口形态，例如单独的启用/停用、批量、导出、复制接口。
- 新的状态值、枚举、校验方式、脱敏或序列化手段，而仓库已有等价做法。
- 改动既有模块的写法：修改既有模块时保留其原有实现，不顺带补它原本没有的校验，也不重构无关代码。
- 新增的装饰器、配置项和抽象要能指出实际消费方；没有运行时消费方的写法不加（例如未注册 `ClassSerializerInterceptor` 时不用 `@Exclude`）。

其余习惯沿用同一套，不逐模块另立风格：

- 命名与签名：后端 `<域>/<业务>` 目录、`xxx.controller/service/module`；前端 `pages/<域>/<业务>` 与 `apis/<域>/<业务>/{index.ts,model.ts}`，API 函数为 `listXxx(params)`、`addXxx(params)`、`updateXxx(id, params)`。
- 注释与文案：实体列注释、业务方法与前端 API 函数用中文注释，页面文案、日志标题为中文。
- 权限码为 `<域>:<业务>:<动作>`，与菜单数据、后端 `@RequirePermissions`、前端 `hasPermission` 三处一致。
- 类型派生方式沿用相邻模块；请求体与响应体形状不同时（如密钥不下发）写显式类型，不用大段 `Omit`、`Partial` 拼装。

## 后端约定

- 后端与公共包使用 TypeScript NodeNext / ESM。源码中的本地模块导入保留 `.js` 扩展名，保持 `experimentalDecorators` 和 `emitDecoratorMetadata` 配置。
- 参与 NestJS 注入的类使用运行时导入；纯类型使用 `import type`。新增 provider、repository 和模块依赖时同步检查 imports、providers、exports。
- Controller 沿用 `AjaxResult` 响应格式；业务异常复用 `ServiceException` 和公共异常过滤器。DTO 沿用 `class-validator`、mapped types 和 `PaginateDto`。
- 新增业务接口时检查 `@RequirePermissions`、`@RequireRoles` 与操作日志 `@Log`。权限码需与菜单数据及前端 `hasPermission` 调用一致。
- 数据范围复用 `@DataScope`、`DataScopeService` 和 `SecurityContext`；检查表别名、列表、详情、导出及写操作的数据范围要求。
- 沿用目标模块的 TypeORM Repository 或 MyBatis Mapper 模式。XML 的 namespace、statement id 与 `getSql` 调用保持一致；SQL 条件遵循 MySQL 方言和参数转义规则。
- `vivy-ai` 使用 PostgreSQL，只存放 AI 业务表；用户、角色、菜单和权限码仍以 `vivy-system` 的 MySQL 为唯一来源，禁止在 AI 库重建这些表。两个服务必须共用同一份 `security.jwt.secret` 和同一 Redis 实例的 db 0，否则登录态无法互认。

## 前端约定

- 复用 Umi Max、Ant Design、ProComponents 与 `src/components` 中的组件；延续现有中文业务文案和交互方式。
- API 请求放在 `src/apis`，类型放在对应 `model.ts`。认证、响应和错误处理沿用 `src/app.tsx` 的统一请求配置。
- 列表与表单参考岗位管理页面的 `ProTable`、`DrawerForm` 和 `UpdateForm` 模式。
- 将 ProTable 的 `current`、`pageSize` 映射为后端的 `page`、`limit`；将返回的 `items`、`meta.totalItems` 映射为表格的 `data`、`total`。
- 字典复用 `useModel('dict')`、`loadDict`、`toSelect` 和 `DictTag`；动态菜单与路由复用 `src/router` 的构建逻辑。
- 按钮权限使用 `Access` / `useAccess`，并同步后端权限检查。表单校验、提交状态、错误反馈和删除确认遵循相邻页面实现。

## 开发命令

以下命令在仓库根目录执行。

| 任务                          | 命令                                |
| ----------------------------- | ----------------------------------- |
| 安装依赖                      | `pnpm install`                      |
| 启动本地 MySQL / Redis / PG   | `pnpm docker:base`                  |
| 构建公共包                    | `pnpm build:common`                 |
| 后端开发服务                  | `pnpm --filter vivy-system dev`     |
| AI 服务开发                   | `pnpm --filter vivy-ai dev`         |
| 前端开发服务                  | `pnpm --filter vivy-react dev`      |
| 构建系统后端                  | `pnpm --filter vivy-system build`   |
| 构建 AI 服务                  | `pnpm --filter vivy-ai build`       |
| 构建前端                      | `pnpm --filter vivy-react build`    |
| 构建文档                      | `pnpm --filter docs build`          |
| 构建全部 workspace            | `pnpm build`                        |
| 单元测试                      | `pnpm test`                         |
| 测试监听                      | `pnpm test:watch`                   |
| 测试覆盖率                    | `pnpm test:cov`                     |
| HTTP / E2E 测试               | `pnpm test:e2e`                     |
| 测试类型检查                  | `pnpm test:typecheck`               |

首次运行应用及修改公共包后，先执行 `pnpm build:common`。开发服务默认端口为系统后端 `9200`、AI 服务 `9201`、前端 `8000`；环境准备见 [本地开发文档](docs/development.md)。

## 验证改动

- 根据改动范围选择检查：文档或技能调整验证内容、路径和格式；业务逻辑调整运行相关测试及受影响应用的构建；公共包调整检查依赖它的应用。
- 单元测试位于 `vivy-common/**/src/**/*.spec.ts`、`vivy-modules/**/src/**/*.spec.ts`；E2E 测试位于 `vivy-modules/**/test/**/*.e2e-spec.ts`。
- 测试使用 Vitest、`@nestjs/testing`、Supertest 和 SWC；保留 `test/setup.ts` 的 `reflect-metadata` 初始化及 SWC 的装饰器转换。
- 当前 E2E 用例使用隔离的 `TestingModule`。新增数据库或 Redis 集成测试时配置独立测试数据和清理逻辑。
- 定向测试可在公共包构建后执行 `pnpm exec vitest run <测试文件>`。
- 对修改的文件运行 `pnpm exec eslint <代码文件>`、`pnpm exec stylelint <样式文件>` 或 `pnpm exec prettier --check <文件>`。根目录 `lint:*` 脚本包含自动修复或写入行为，执行时注意改动范围。
- 交付时说明改动内容、完成的验证及尚未验证的事项。

## 常用参考

- [系统权限](docs/back/common/security.md)
- [数据权限](docs/back/common/datascope.md)
- [MyBatis 插件](docs/back/plugin/mybatis.md)
- [代码生成](docs/back/business/gen.md)
- [数据库初始化（MySQL）](sql/mysql/vivy-nest-admin.sql)
- [AI 服务初始化（PostgreSQL）](sql/postgres/vivy-ai.sql)
