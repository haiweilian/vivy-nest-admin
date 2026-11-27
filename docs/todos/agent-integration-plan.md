# 企业级 Agent 集成计划与现状

记录日期：2026-11-25。初次调研的 Vivy 源码基于提交 `9290ce0`；参考项目 aicreation 基于提交 `c1c25c1`。本轮实现记录包含工作区新增的模型模块。

最近更新：2026-11-26，模型管理保留基础连接配置，DTO 进一步对齐已有模块的简单写法。

本文记录本次讨论形成的方向、源码现状、参考实现和后续待办，供继续开发时恢复上下文。第一步模型管理与连接测试已完成代码实现；Agent 聊天、RAG、业务 Skills 和 MCP 仍处于规划阶段，选型与参考项目已有能力分别说明。

## 目标与讨论结果

希望在当前后台系统中集成企业级 Agent，同时通过实际功能学习主流 Agent 的实现方式：

1. 查询当前项目的业务数据，完成统计、分析和报告。
2. 接入内部知识库 RAG，回答时提供可核验的来源。
3. 支持业务 Skills，复用任务流程、领域规则和报告模板。
4. 将本项目业务能力提供为 MCP，并允许内部 Agent 接入外部 MCP。
5. 逐步学习工具调用、上下文管理、任务规划、子 Agent、审批、记忆、执行恢复和效果评估。

讨论方向收敛为：**NestJS + 官方 Nest MCP 模块 + DeepAgents SDK + LangChain/LangGraph 底座 + Ant Design X**。业务数据继续使用 MySQL，复用 Redis、Bull、文件服务、权限和数据范围；向量库与 checkpoint 的具体部署方案通过 PoC 确定。

| 项目                                          | 当前状态                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| 项目已有能力与权限链路                        | 已完成源码阅读                                                                  |
| Nest 官方 MCP 模块、LangChain/DeepAgents 关系 | 已完成官方资料与 npm 元数据核对                                                 |
| Ant Design X 聊天页                           | 用户提出采用 Ant Design 体系；已核对组件、SDK 和依赖范围，尚未接入              |
| aicreation 的 canvas-agent                    | 已阅读文档、核心运行代码、数据结构、流协议、会话状态及相关测试定义              |
| aicreation 的 Agent 模型配置                  | 已阅读模型表、管理 CRUD/表单、脱敏目录、Provider 工厂与会话选模，已整理迁移方案 |
| 本项目 Agent、RAG、业务 Skills、MCP           | 尚未实现                                                                        |
| 模型管理、模型目录与连接测试                  | 已实现基础连接配置、管理页面、权限与三种适配器的连接测试                        |
| AI 初始化与依赖安装                           | 已锁定模型 SDK；AI 菜单写入初始化 SQL，增量脚本见 `sql/upgrade/`                |
| 模型基础验证                                  | 精简后单元测试 11 项、隔离 MySQL HTTP 测试 10 项通过；前后端构建与类型检查通过  |
| 真实模型效果、检索效果与完整 Agent 运行       | 尚未验证；已有业务数据库需手动执行 `sql/upgrade/ai-model-menu.sql`              |

本次对参考项目进行源码阅读，没有运行其测试或真实模型。本文中的“参考实现已有”表示代码已存在，不代表本次完成了运行验证。

模型验证使用本地模拟的 OpenAI/DeepSeek/Anthropic 服务与隔离 MySQL，真实 LangChain SDK 参与请求；身份由测试夹具提供，使用项目真实权限守卫。未运行参考项目测试，未调用真实模型账号，也未修改已有业务数据库。使用与部署步骤见 [AI模型管理](../back/business/ai-model.md)。

## 第一步实现记录

用户批准先实现模型管理与连接测试，并要求 AI 使用独立根菜单、`ai_` 表名和独立初始化 SQL。本轮完成以下内容：

- 后端新增 `src/modules/ai/model/`，实体为 `AiModel`，表名为 `ai_model`；接入现有 TypeORM、AjaxResult、DTO 校验、操作日志和权限守卫。
- 前端新增 `src/pages/ai/model/` 与 `src/apis/ai/model/`，复用 ProTable、DrawerForm、字典和权限按钮，提供查询、新增、编辑、复制、启停、删除和测试。
- 接口密钥明文保存到 `secret_key`；列表/详情仅显示 `hasCredential`。编辑省略密钥表示保留，复制要求重新输入。
- 模型表仅保存适配器、来源、显示名称、调用标识、接口地址、接口密钥、状态和审计字段。
- 连接测试支持 OpenAI 兼容、DeepSeek、Anthropic，验证文本流或一次测试工具调用；测试调用方自行设置 30 秒超时、256 Token 输出上限、温度 0、无重试，缺失用量返回未知。
- 部分更新直接使用 Repository，只写入提交的字段。服务端调用方通过 `ModelService.find()` 读取连接信息，自行创建模型实例、设置调用参数。停用模型不进入可选目录，但允许连接测试。当前没有 Run 表或会话选模。
- 菜单写入 `sql/vivy-nest-admin.sql`（“AI管理 → 模型管理”加 6 个权限按钮，新安装即包含）；已有库用 `sql/upgrade/ai-model-menu.sql` 补数据，脚本不写死 `menu_id`、可重复执行。`ai_model` 表由实体 `synchronize` 创建。

精简后的验证：单元测试 11 项、隔离 MySQL HTTP 测试 10 项通过，公共包与前后端构建、前端及测试类型检查、ESLint 均通过。独立 MySQL 验证了精简表结构；临时库中执行初始化脚本得到 8 条 AI 菜单，增量脚本重复执行不产生重复数据。尚未完成真实供应商调用、浏览器交互与现有环境部署验证。

主要验证命令：

- `pnpm build:common`
- `pnpm --filter vivy-system build`
- `pnpm --filter vivy-react build`
- `pnpm --filter vivy-react exec tsc --noEmit`
- `pnpm exec tsc --project tsconfig.spec.json`
- `pnpm exec vitest run vivy-modules/vivy-system/src/modules/ai/model/dto/model.dto.spec.ts vivy-modules/vivy-system/src/modules/ai/model/model-connection.service.spec.ts`
- 配置独立测试库的 `AI_TEST_MYSQL_URL` 后，`pnpm exec vitest run --config vitest.config.e2e.ts vivy-modules/vivy-system/test/model.e2e-spec.ts`。
- `pnpm --filter docs build`，以及受影响代码/文档的 ESLint、Prettier 检查。锁文件沿用 pnpm 生成格式。

下一步接入 Ant Design X、DeepAgents、会话和 Run：通过 `ModelService.find()` 读取连接信息，在 Agent 模块组装 SDK 实例及运行参数，再增加会话选模、业务工具授权及流协议。

### 2026-11-26：对齐现有代码约定

用户指出初版将校验单独写在 DTO，缺少 Entity 复用和业务注释。本次按岗位模块的现有模式整理：

- 普通持久化字段的校验放在 `AiModel`，包含接口密钥。
- 新增 DTO 用 `OmitType` 排除 ID，更新 DTO 使用默认 `PartialType` 支持部分提交；查询项和测试模式在 DTO 定义。ID 和审计字段由全局白名单及服务端写入逻辑控制。
- Entity 保留数据库列注释并沿用现有多行列配置，补齐 DTO、Controller、Service 及模块的业务注释；注入成员使用具体业务名称。
- 校验仍由全局 `ValidationPipe` 在 DTO 上执行，实体中的规则经 mapped types 继承；更新省略密钥或传 `null` 表示保留，空字符串仍拒绝。

历史验证：精简前模型单元测试 16 项、隔离 MySQL HTTP 测试 10 项通过，AI SQL 重复导入保留模型与 8 个菜单，前后端构建与类型检查通过。这些结果对应旧结构；已移除功能的测试随本次精简删除，当前结构重新验证。

已同步更新 `AGENTS.md` 及 `vivy-fullstack-crud` 的入口、后端参考和验证规范，明确 Entity 校验复用、请求专用字段、部分更新语义、业务命名与注释，供后续模块沿用。

### 2026-11-26：精简模型管理

用户明确指出“这个地方只是配置下模型”，本轮以此为最终约定：

1. 删除加密解密及部署主密钥配置，接口密钥直接保存为 `secret_key`。
2. 删除模型表、DTO、前端表单中的运行参数。实际运行由调用方设计，连接测试的固定参数也由测试服务设置。
3. 删除 `configVersion`、版本递增、冻结执行配置及通用模型工厂。

已有 Entity 校验、业务注释、CRUD、AI 根菜单、权限、密钥保留/替换和连接测试继续使用。初始化 SQL 已同步到精简结构；若此前导入过旧版 AI 表，需要调整表结构并重新填写密钥，重复导入不会转换旧表。此前关于模型模块负责加密、运行参数或版本管理的方案已取消。

### 2026-11-26：进一步简化 DTO

用户要求优先参考已有写法，除非原写法存在严重问题。本轮对齐岗位、通知公告等模块：

- 新增使用 `OmitType(AiModel, ['id'])`，实体负责持久化字段校验，状态沿用 `@IsOptional()`。
- 更新保留默认 `PartialType(CreateModelDto)`，支持编辑时省略密钥及已有部分提交；去掉所有 `skipNullProperties` 选项。
- 查询直接继承 `PaginateDto`，搜索、适配器和状态使用 `@Allow()`；去掉组合继承、专用转换/空值辅助函数及模型独有的分页上限。
- 可选字段采用默认校验语义；更新中的 `null` 按未提供处理，新增密钥仍必填，空字符串密钥仍拒绝。
- 同步 `AGENTS.md` 与 CRUD 技能，避免后续模块默认引入额外的 DTO 复杂度。

本轮 DTO 简化的验证结果将在检查完成后补充。

## 当前项目可复用的基础

| 基础       | 当前实现与参考位置                                                               | Agent 接入用途                                  |
| ---------- | -------------------------------------------------------------------------------- | ----------------------------------------------- |
| 后端       | NestJS 12、TypeScript NodeNext/ESM；`vivy-modules/vivy-system/src/app.module.ts` | 模块、DI、Controller、任务与业务 Service        |
| 业务数据库 | MySQL、TypeORM；部分业务已有 MyBatis                                             | 配置、会话、消息、Run、文档元数据、受控业务查询 |
| 登录会话   | JWT + Redis；`vivy-common/vivy-common-security`                                  | 聊天请求身份、会话有效性与授权                  |
| 功能权限   | `@RequirePermissions`、`@RequireRoles`、AuthService                              | Agent 与 MCP 工具的操作权限                     |
| 数据范围   | `SecurityContext`、`@DataScope`、DataScopeService                                | 部门/本人范围内的查询、统计、详情和导出         |
| 队列       | `@nestjs/bull` + Bull 4 + Redis                                                  | 文档处理、索引构建、后续后台 Run                |
| 文件服务   | `modules/file`，当前使用磁盘上传，已有 OSS 实现                                  | 文档上传、来源文件与报告产物                    |
| 前端       | React 19、Umi Max、Ant Design 6、ProComponents                                   | AI 工作台、配置管理与动态菜单                   |
| 图表       | 已有 `@ant-design/charts`                                                        | 分析结果的图表展示                              |
| 请求与主题 | `vivy-react/src/app.tsx`、`src/components/App`                                   | 认证、错误反馈、现有主题与交互                  |
| 验证       | Vitest、Nest TestingModule、Supertest、VitePress                                 | 工具授权、状态一致性与文档验证                  |

初次调研时没有 AI 依赖。第一步已在 `vivy-system` 安装 `@langchain/core` 及 OpenAI/DeepSeek/Anthropic 适配包；DeepAgents、`langchain`、LangGraph、Nest MCP、Ant Design X 和 Qdrant 仍未接入。

## 技术选型与各层职责

| 层次       | 讨论后的方向                                              | 职责与边界                                                   |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| 应用后端   | 现有 NestJS                                               | 业务模块、授权、事务、运行控制与 API                         |
| MCP Server | `@nestjs/mcp`                                             | 用 Provider 装饰器暴露工具、资源和提示词，复用 Nest 生命周期 |
| 业务 Agent | 自托管 `deepagents` SDK                                   | Skills、规划、虚拟工作文件、子任务与上下文管理               |
| Agent 组件 | `langchain`、`@langchain/core` 及按需 Provider/检索适配包 | 模型、工具、Agent 循环、中间件与检索组件                     |
| 执行底座   | `@langchain/langgraph`                                    | 状态、流式事件、checkpoint、审批中断与执行恢复               |
| 聊天 UI    | `@ant-design/x`                                           | 气泡、输入、会话、工具进度与引用                             |
| 前端数据流 | `@ant-design/x-sdk`                                       | 自定义 Chat Provider、会话数据、流式请求与状态               |
| Markdown   | `@ant-design/x-markdown`                                  | 流式 Markdown；重组件和插件按需加载                          |
| 业务存储   | 现有 MySQL                                                | 模型/Agent 配置、会话、消息、Run、知识库元数据               |
| 向量索引   | Qdrant 优先候选                                           | 向量、文档元数据过滤；后续混合检索与 Rerank                  |
| 异步任务   | 现有 Bull + Redis                                         | 初期文档处理，后续后台 Agent Worker                          |
| 观测       | 现有 Logger + Run/工具调用记录，后续评估 Langfuse         | 用量、成本、耗时、错误和评估轨迹                             |

DeepAgents 基于 LangChain Agent 和 LangGraph 执行能力。业务代码可以从 `createDeepAgent()` 开始；学习基础工具循环时使用 `createAgent()`，需要明确分支、固定审批流程等精细控制时再编写自定义 LangGraph。

模型先评估支持工具调用的通义千问或 DeepSeek。聊天、Embedding、Rerank 分别配置，使用实际中文任务和文档决定具体模型；不假定某个聊天供应商同时提供所有检索模型。

### 版本与兼容性快照

第一步已实际锁定并通过 NodeNext/ESM 构建的版本为 `@langchain/core@1.5.1`、`@langchain/openai@1.8.5`、`@langchain/deepseek@1.1.26`、`@langchain/anthropic@1.6.6`；SDK 要求 Node.js 22 及以上，本轮使用 Node.js 24。

以下为讨论时查询的其他 npm 元数据或参考源码依赖声明，尚未安装到 Vivy：

- `@nestjs/mcp` 为 `0.0.4`，peer 要求 NestJS `^12.0.0`、官方 MCP Server/Client SDK `^2.4.0`。处于早期版本，需要锁版本并验证项目守卫与异常处理。
- 官方 MCP TypeScript SDK v2 使用 `@modelcontextprotocol/server`、`@modelcontextprotocol/client` 分包；Vivy 的 MCP Server 优先由 Nest 模块承接。
- Ant Design X 的 UI、SDK、Markdown 三个包均为 `2.10.0`；UI peer 要求 antd `^6.1.1`、React/ReactDOM `>=18`，与本项目声明的 antd `^6.7.2`、React `^19.3.1` 范围匹配。
- 用户提供的 Ant Design X 国内站显示 `2.5.0`，与 npm 版本有差异。开发时统一锁定三个包版本，按相应版本文档确认 API。
- aicreation 声明 `deepagents ^1.17.0`、`langchain ^1.6.7`、`@langchain/langgraph ^1.7.5`、`@langchain/langgraph-checkpoint-postgres ^1.1.4`。

### checkpoint 与向量存储仍待 PoC

聊天记录、知识库索引和框架 checkpoint 是不同职责，应分别设计。

| 方案                                               | 已知情况                                       | 待确认内容                                                                                                    |
| -------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| MySQL 业务表 + Qdrant + RedisSaver                 | 前轮讨论的优先候选；可延续现有技术体系         | RedisSaver 需要 RedisJSON、RediSearch，可采用 Redis 8/Redis Stack；确认实例、持久化、备份、保留期限与淘汰策略 |
| MySQL 业务表 + Qdrant + PostgresSaver              | 参考项目已经采用 PostgresSaver，便于复用经验   | 需要新增 PostgreSQL；确认增加一套存储的运维成本                                                               |
| MySQL 业务表 + PostgreSQL/pgvector + PostgresSaver | 可作为合并 AI 向量与 checkpoint 存储的替代方案 | 需要重新评估检索能力、过滤方式和运维选择                                                                      |

此次未确认官方 MySQL Saver，不把 MySQL 消息表当成 LangGraph checkpoint。采用不同存储时，通过 checkpoint 持久化确认、逻辑引用与幂等业务收尾保证一致性；不假定它们处于同一数据库事务。

## 功能范围

### 业务数据查询与分析

先实现有明确业务语义的只读工具，例如用户查询、部门统计、近七天登录失败统计。工具校验参数、检查权限、调用受数据范围约束的查询；后端计算指标，模型解释结果并组织报告。

统计、详情、导出都核验数据范围，结果使用结构化 artifact 提供给表格、图表或报告组件。Text-to-SQL 留作后续专题，届时单独设计只读账户、查询校验、范围条件、行数上限和超时。查询继续适配现有 TypeORM/MyBatis 模式，新增 XML 仅在具体需求明确需要时使用。

### 内部知识库 RAG

基本流程：上传 → 解析 → 切片 → Embedding → 索引 → 按权限检索 → 生成带引用的回答。

初期支持 Markdown、TXT、PDF、DOCX，复用文件服务和 Bull 队列。记录文档版本、切片位置和索引状态，支持更新、删除后的索引同步。后续增加关键词/向量混合检索、Rerank、OCR 和检索效果评估。

文档 ACL 由后端转换为检索过滤条件，并在内容进入模型前验证访问权限。SQL 的 DataScope 不会自动约束向量数据库。引用应包含文档标识、标题、页码或片段定位；来源预览与下载同样执行授权。

### 业务 Skills

采用 Agent Skills 的 `SKILL.md`、`references/`、`assets/` 等组织方式，通过 DeepAgents 配置按需加载：先提供名称与描述，命中任务后读取指令，再读取所需资料。

优先示例为“登录异常分析”“部门情况汇总”“固定模板报告”。技能需要独立的目录、版本、发布和访问控制，工具执行权限由服务端裁定。仓库 `.agents/skills` 目前属于开发技能，业务 Agent 的技能另行管理。

虚拟工作文件用于会话内材料整理；需要执行脚本时再接入隔离沙箱和运行限制。长期用户偏好、跨会话记忆作为后续独立能力设计，不与公共知识库混用。

### MCP 的两个方向

1. **Server**：Nest 中用 `McpModule`、`@Tool`、`@Resource`、`@Prompt` 注册业务能力，工具 Provider 注入现有 Service。
2. **Client**：内部 Agent 按需接入企业其他系统的 MCP，将外部能力适配为 Agent 工具。

官方 Nest 包需要明确的工具声明、描述和 Schema；安装包本身不会自动转换全部 GET/POST 路由。Swagger/OpenAPI 可以帮助整理工具草稿，最终按业务语义、权限和结果契约筛选。

内部 LangChain 工具和 MCP Provider 共用工具定义及授权后的执行入口。远程部署使用 Streamable HTTP，本地调试可使用 stdio；通用远程客户端接入时评估 OAuth 2.1 授权层、企业身份系统及现有业务用户的映射。

## 前端聊天页

用户明确提出优先使用 Ant Design 体系，建议以 Ant Design X 三个包建设 AI 工作台。模型、Agent、知识库、Skills、MCP 和运行记录管理页面继续使用现有 ProTable/DrawerForm/菜单权限。

| 页面能力                     | 组件或实现                                |
| ---------------------------- | ----------------------------------------- |
| 会话列表与历史管理           | `Conversations`                           |
| 消息内容与自定义结果         | `Bubble.List`、`Bubble`                   |
| 输入、发送、停止入口         | `Sender`、`Suggestion`                    |
| 欢迎和推荐问题               | `Welcome`、`Prompts`                      |
| 附件及报告文件               | `Attachments`、`FileCard`，接现有文件接口 |
| 工具、检索、规划和子任务进度 | `ThoughtChain` 与业务消息组件             |
| 知识库来源                   | `Sources`                                 |
| 复制、重试、反馈             | `Actions`                                 |
| 分析与审批结果               | 气泡中嵌入现有表格、图表、Card 和权限按钮 |

第一版布局为左侧会话列表、中间消息和输入区，引用与分析结果支持展开。后续可以在普通业务页面增加侧边助手，并由后端验证当前页面提供的目标上下文。

普通管理请求沿用 Umi 的统一 request；聊天流用 X SDK 的自定义 Chat Provider 适配 Nest Agent 服务。XRequest 使用 Fetch，不会自动经过 `src/app.tsx` 的 Umi 拦截器，需要单独复用 Token 获取、地址、登录失效和错误反馈逻辑。模型密钥与执行配置由后端管理。

消息数据选择一个状态所有者，结合 `useXChat` 管理消息；会话级草稿、模型选择、Run、审批与连接生命周期按需封装，避免消息在多套状态中漂移。借鉴参考实现的有序 parts、增量批处理和会话隔离，重 Markdown 插件、图表与大段工具结果按需加载或展开。

### 参考消息格式与 Ant Design X 的对应

已对照参考模块的 `schemas.ts`/`state.ts`、Ant Design X 文档，以及 npm `@ant-design/x-sdk@2.10.0` 的类型声明。**结构上可以对齐，业务消息和 SSE 协议可以保留；需要前端 Provider、运行协调与内容渲染适配。** 尚未完成接入 PoC 或运行验证。

X SDK 的 `ChatMessage` 是可自定义的泛型，可以保留 `AgentMessage` 的 `id`、`role`、`parts`、`runId` 等信息；SDK 在它外面包装 `MessageInfo`，包含 SDK 自己的 `id`、`message` 和请求 `status`。Bubble 支持对象内容和 `contentRender`，可在同一条消息中按原顺序渲染全部 parts。

推荐接入关系：

```text
业务 AgentMessage / SSE 事件
  → SSE 解码与 Schema 校验
  → AgentChatProvider + 会话/Run 协调
  → useXChat 的 MessageInfo<AgentMessage>
  → Bubble.List 的 key、role、content、status
  → AgentMessageParts 按 part.id 和 type 渲染
```

| 参考格式                       | Ant Design X 对应                               | 适配内容                                                                                    |
| ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Conversation`                 | `Conversations`、`conversationKey`              | 服务端会话 ID 映射为会话 key，标题与操作接现有业务 API                                      |
| `AgentMessage`                 | `MessageInfo<AgentMessage>`、`Bubble.List` item | SDK 外层 ID 与业务 message.id 分开；role 可将 assistant 映射为 ai；content 保留业务消息对象 |
| `text` part                    | `XMarkdown`                                     | 渲染当前文本段，按业务流状态控制 streaming                                                  |
| `reasoning` part               | `Think` 与自定义内容                            | 显示模型公开提供的内容、等待与耗时                                                          |
| `tool` part                    | `ThoughtChain` + 工具结果组件                   | 状态、参数、输出与 artifact；复用按工具名称注册 renderer 的设计                             |
| `todos` part                   | `ThoughtChain` 或任务列表                       | 将 pending/in_progress/completed 映射为展示状态                                             |
| `subagent` part                | `ThoughtChain` 或子任务卡片                     | 独立展示名称、状态、描述与结果，保留原顺序                                                  |
| 后续引用、文件、图表、审批类型 | `Sources`、`FileCard`、现有图表/表格、审批 Card | 新增明确的业务 Schema 和 renderer；当前参考模块并未实现这些类型                             |

Provider 继承 `AbstractChatProvider`，实现请求参数、本地用户消息、响应消息的转换。正文和 part 快照可以借鉴 `applyAgentEvent` 中按 messageId/partId 更新的纯逻辑。SDK 的 `parser` 可生成展示数据，或直接使用 Bubble 的 `contentRender` 分派 parts；业务 Run 与会话元数据由运行协调层管理。

接入时保留以下语义：

1. **消息身份**：SDK `MessageInfo.id` 与业务 `AgentMessage.id` 不混用。`run.started` 将本地用户消息和助手占位绑定到服务端 ID，流中保持 SDK 管理 ID 稳定；历史与最终快照按业务 ID 去重，防止重复消息。
2. **事件与运行状态**：`run.started` 同时包含 Run 和两条消息，`run.finished` 还包含会话信息；Provider 的 `transformMessage` 每次返回一条消息，这两类事件需要协调层同步其他对象。文本增量和 part 快照保持原有协议。
3. **展示状态与业务终态**：SDK 的 loading/updating/success/error/abort 描述请求和展示；业务仍保留 running/completed/failed/cancelled。助手消息的 complete、failed、cancelled 分别映射为展示 success、error、abort，streaming 按是否已有内容显示 loading/updating；已确认用户消息可使用 local。展示以业务终态为准，HTTP/SSE 正常结束不代表 Run 成功，缺少 `run.finished` 时进入同步恢复。
4. **停止**：Sender 停止入口调用业务 cancel API，保留流等待最终快照。X SDK 的 `abort()` 负责中断前端请求，按断连/清理语义单独使用；Run 取消仍由后端执行与收尾。
5. **重试**：参考实现创建新 Run 和新助手消息，保留旧尝试。SDK 的 `onReload()` 是更新指定消息的重新生成入口，需要封装为业务重试操作，避免覆盖旧尝试或重复添加原用户消息。
6. **混合内容与动画**：对象内容中的文本、工具、规划和卡片逐段渲染。Bubble 自带打字动画主要面向字符串；对象形式的 parts 用 XMarkdown 和具体内容组件处理流式变化，不假定自动获得整条消息的打字效果。

PoC 至少验证本地占位与服务端消息去重、同会话的多 part 顺序、切换会话后的事件归属、正常断流与业务失败/取消的区别、终态快照、保留旧尝试的重试、公开 reasoning 和工具 artifact 展示。此处确定的是适配方向，不是已经完成接口联调。

## 参考实现：aicreation / canvas-agent

参考路径：

```text
/Users/lian/Desktop/Lian/github/aicreation/src/features/studio/canvas-agent
```

它是 Next.js 中的 DeepAgents 聊天模块，UI 使用 shadcn 体系的本地组件、Tiptap Markdown 和 Zustand 状态；服务端使用 Route Handler、Drizzle、PostgreSQL 和 PostgresSaver。相关业务表在 `src/db/schemas/canvas-agent.ts`，API 在 `src/app/api/studio/canvas-agent/`。

### 已有能力与未接入部分

| 参考实现已有                                                       | 源码依据                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| DeepAgents、规划、会话内虚拟工作文件、默认子任务                   | `runtime/agent.ts`：`createDeepAgent`、`StateBackend`、规划中间件 |
| 项目会话、模型选择、发送、停止、重试、历史管理                     | `services/`、`stores/`、`actions/api.ts`                          |
| 可用模型目录与服务端模型配置分开，支持三种 Provider 适配器         | `services/models.ts`、`runtime/model.ts`                          |
| 运行时冻结用户、项目、画布、模型与 Run 上下文                      | `services/runs/prepare.ts`、`schemas.ts`                          |
| 会话、消息和 Run 分表，请求幂等与单会话运行互斥                    | 数据表定义、`services/runs/mutations.ts`                          |
| 框架状态持久化、从成功分支继续、失败/取消不推进成功起点            | `runtime/checkpointer.ts`、`services/stream.ts`                   |
| 框架事件转换为有序业务消息 parts，正文、工具、规划、子任务分开展示 | `runtime/protocol.ts`、`schemas.ts`、`state.ts`                   |
| SSE 分块解码、Schema 校验、增量批处理与终态快照                    | `actions/stream.ts`、`services/stream.ts`                         |
| 工具名称到自定义结果组件的注册表                                   | `components/messages/tool-renderers/`                             |
| 回滚、停止竞态、checkpoint、超时、断流及网络分块的测试定义         | `services/runs/__tests__/`、`actions/stream.test.ts` 等           |

参考模块当前没有接入业务 Skills 配置、RAG、MCP 或用户审批流程；真实画布读取、节点编辑、素材生成和网页浏览工具也尚未接入。虚拟工作文件保存在框架状态中，不能据此视为拥有宿主文件系统或业务画布操作能力。

它的执行生命周期依附发送请求：执行连接断开时中止执行并保存部分结果，异常遗留 Run 通过后续读取回收。已有 Run 的重复请求只读取快照，属于订阅回放，不重新执行模型；回放连接断开不会取消原执行。后台 Worker、持久化事件日志和刷新后的自动续接仍属于后续扩展。

### 最值得复用的设计

1. **会话、消息、Run、checkpoint 分工**：页面历史读取业务消息表；Agent 下一轮从成功 checkpoint 恢复。一个 Run 表示一次尝试，重试保留原输入并创建新的助手消息和 Run。
2. **先提交业务事务，再执行模型**：会话锁、锁内幂等检查、运行互斥、序号分配和消息占位先原子提交，模型执行期间不占用长事务。
3. **稳定业务协议**：LangGraph v3 事件通过唯一适配入口转成业务 parts，UI 和数据库不依赖供应商原始事件。part 首次出现的位置在增量、快照和历史中保持一致。
4. **可靠收尾**：确认本轮根图 checkpoint 已持久化后，事务提交 Run、完整回复和成功指针。旧执行器只能写仍在运行的 Run；已提交的停止意图参与最终状态裁定。
5. **停止与断流分开处理**：停止按钮提交服务端取消意图，保留 SSE 接收最终快照；关闭执行连接则走断连取消。缺少最终事件时保留部分回复，以服务端已保存状态同步。
6. **会话级状态和连接身份**：每段会话保留草稿、模型、消息和 Run；切换视图不让迟到事件写入其他会话，生命周期清理使旧请求失效。
7. **结果组件扩展**：工具文字与结构化 artifact 分开，按工具名称注册 Summary/Details；业务表格、图表和文件卡片可以沿用这个扩展点。
8. **模型目录与执行配置分开**：前端只获取可选模型的展示字段；服务端在新 Run 前读取当前连接配置，并固定本轮模型。跨 Provider 的历史兼容处理集中在模型适配层。

参考实现使用 64ms 增量批处理、事件驱动的 750ms 部分保存、15 秒 SSE 心跳、180 秒执行超时。它们是参考参数，Vivy 按消息量、模型耗时和存储压力配置与验证。

## 迁移到 Vivy 时的差异

| 参考项目方式                                       | Vivy 适配方向                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Next Route Handler / `server-only`                 | Nest Controller、Provider 与明确的运行入口；保留 NodeNext/ESM 和运行时 DI 导入       |
| Drizzle + PostgreSQL、JSONB                        | TypeORM + MySQL、JSON；事务和返回结果按当前依赖实现                                  |
| PostgreSQL `WHERE status = 'running'` 部分唯一索引 | MySQL 重新设计会话运行槽，使用会话行锁与 activeRunId 等约束；不直接复制 DDL          |
| 同一个 PG 连接池与独立 checkpoint schema           | MySQL 业务表 + 经 PoC 选择的 Saver，明确跨存储逻辑引用和收尾                         |
| 项目/画布拥有者授权                                | 当前登录身份 + 权限码 + 部门/本人数据范围；上下文归属随业务决定                      |
| shadcn、Tiptap、本地 Bubble 与工具 UI              | Ant Design X、X Markdown、现有 Ant Design 图表和业务组件                             |
| Zustand、手写 SSE 请求与合并                       | 优先 X SDK 自定义 Provider，保留生命周期与协议语义，按需复用纯状态逻辑               |
| 请求依附的 Run                                     | 一期可采用相同生命周期；长任务阶段增加 Bull Worker、事件持久化、订阅游标和服务端取消 |
| 全量历史和前端搜索                                 | 企业聊天历史规划分页或游标，按实际数据规模验证                                       |
| 已有结构化结果与默认框架工具                       | 扩展受权限约束的业务工具、RAG、业务 Skills 和 MCP                                    |

参考仓库的类、表名、画布归属、UI、数据库特性和固定超时不整体搬入本项目。优先复用运行不变量、协议、纯状态函数及对应测试场景。

## 模型配置的迁移方案

用户补充要求保留参考项目的 Agent 模型配置能力。**模型管理和连接测试已作为第一步实现，聊天选模继续纳入阶段 1**，最终完成“后台配置 → 可选模型目录 → Agent 读取连接并组装调用 → DeepAgents 调用”的闭环。

### 参考项目的模型管理现状

参考仓库根目录为 `/Users/lian/Desktop/Lian/github/aicreation`，以下路径均相对此目录：

| 链路               | 参考源码                                                                                                                                                              | 当前行为                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 数据结构           | `src/db/schemas/model.ts` 中的 `modelAgent`                                                                                                                           | `model_agent` 表保存模型连接信息，默认停用                                             |
| 管理服务与校验     | `src/features/admin/model-agents/services/model-agents.ts`、`schemas.ts`、`types.ts`                                                                                  | 分页、搜索、Provider/启停筛选、创建、详情、部分更新、删除；使用 Drizzle/PostgreSQL     |
| 管理 API           | `src/app/api/admin/model-agents/route.ts`、`[id]/route.ts`                                                                                                            | 管理接口要求 `admin` 角色                                                              |
| 管理页面           | `src/features/admin/model-agents/components/`                                                                                                                         | 配置表单、编辑、复制、启停与删除；“测试智能体”按钮只有关闭菜单逻辑，尚未实现模型测试   |
| 聊天模型目录       | `src/features/studio/canvas-agent/services/models.ts`、`src/app/api/studio/canvas-agent/models/route.ts`                                                              | 登录后读取启用且受支持的模型，只返回 `id/provider/vendor/modelName/modelCode`          |
| 模型调用与历史兼容 | `src/features/studio/canvas-agent/runtime/model.ts`、`runtime/agent.ts`、`runtime/model.test.ts`                                                                      | Provider 工厂创建 LangChain 模型，交给 `createDeepAgent`；请求副本适配跨 Provider 历史 |
| 选模与运行准备     | `src/features/studio/canvas-agent/stores/agent-model-store.ts`、`stores/agent-session-store.ts`、`components/controls/model-selector.tsx`、`services/runs/prepare.ts` | 目录请求去重、会话级选模、新 Run/重试读取当前配置，重复请求回放原 Run                  |

参考项目表名和管理文案使用“Agent/智能体”，这张表实际保存的是模型连接配置。其 `provider` 是 `openai/deepseek/anthropic` 适配器类型，`vendor` 是用于展示的模型来源，`modelCode` 才是发给模型服务的标识；这里没有 Agent 的系统提示词、工具、Skills 或知识库绑定。

聊天目录已经排除了密钥和接口地址。已读管理 CRUD 路径将 `secretKey` 直接写入 `text` 列，列表和详情通过 `mapModelAgent()` 回传完整密钥，新增/编辑/复制表单用文本控件显示并预填密钥。Vivy 按用户要求直接保存密钥；管理列表、详情和编辑表单仅展示是否已配置，编辑或复制时不回显原密钥。

### Vivy 的职责和字段映射

第一步已新增 `ai/model` 模块和 `ai_model` 表，实体为 `AiModel`，独立“AI管理”根菜单下提供“模型管理”。Agent 定义后续另行描述系统提示词、工具、Skills、知识库、默认模型与允许选择的模型；一期单个内置 Agent 可以先引用模型配置，完整 Agent 管理按后续需求增加。

| 参考字段                 | Vivy 实现或后续扩展                                     | 迁移约定                                                                                      |
| ------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `id`                     | `id`，服务端用 `nanoid()` 生成字符串主键                | 发送、重试和 Run 中的 `modelAgentId` 后续统一改为 `modelId`，同步 API 类型、SSE 和历史快照    |
| `provider`               | 受校验的 Provider 枚举                                  | 先保留三种适配器；它决定调用协议和 SDK，不根据 `vendor` 文本选择代码                          |
| `vendor`                 | `vendor`                                                | 展示实际来源，如 OpenAI、DeepSeek、通义或企业网关                                             |
| `modelName`、`modelCode` | 保留名称与标识，分别校验长度                            | 名称用于展示，标识用于模型请求；同一标识可能配置不同服务地址，不设置全局 `modelCode` 唯一约束 |
| `baseUrl`                | 服务端连接地址，最多 2048 字符                          | 按 Provider 校验协议、地址和路径约定，不能对所有 Provider 统一补 `/v1`；聊天目录不返回该字段  |
| `secretKey`              | 明文保存到 `secret_key`，校验定义在实体                 | 列表/详情只返回 `hasCredential`；服务端调用方通过 `ModelService.find()` 读取密钥              |
| `enabled`                | `status`，复用 `BaseStatusEnum` 与 `sys_normal_disable` | `true → '0'`、`false → '1'`；新配置默认 `'1'`，保留默认停用行为                               |
| `createdAt`、`updatedAt` | `createTime`、`updateTime`                              | 复用 `BaseBusinessEntity`，创建/修改人从 `SecurityContext` 取得                               |
| `icon`                   | 当前未迁移到模型表                                      | 根菜单使用已有 robot 图标，模型独立图标按后续展示需求增加                                     |

管理 DTO 已通过 mapped types 复用实体的 `class-validator` 规则，并复用 `PaginateDto`；请求专用字段留在 DTO，模型测试使用固定工具 Schema。业务工具和流协议接入时再同步 Zod 契约。TypeORM Repository/QueryBuilder 已替换 Drizzle 的 `ilike`、`.returning()` 和分页结构，按 MySQL 排序规则及参数绑定查询。

一期一条模型配置包含一套连接信息即可；同一连接需要被多个模型复用时，再拆出连接/凭据实体。RAG 阶段增加聊天、Embedding、Rerank 的用途和各自适配器，知识库明确绑定 Embedding 模型及维度；切换 Embedding 模型需要重新构建索引，不能仅替换模型 ID。

### 管理 API 与 Ant Design 前端

以下接口已实现。管理请求使用 `AjaxResult`，分页返回 `items/meta`，前端沿用 Umi request 的认证和错误处理：

| 操作                          | 接口                        | 权限              |
| ----------------------------- | --------------------------- | ----------------- |
| 分页、搜索、Provider/状态筛选 | `GET /ai/models`            | `ai:model:list`   |
| 编辑初始化                    | `GET /ai/models/:id`        | `ai:model:query`  |
| 新增配置                      | `POST /ai/models`           | `ai:model:add`    |
| 修改配置或更换密钥            | `PUT /ai/models/:id`        | `ai:model:update` |
| 启停配置                      | `PUT /ai/models/:id/status` | `ai:model:update` |
| 删除配置                      | `DELETE /ai/models/:id`     | `ai:model:delete` |
| 测试已保存的连接              | `POST /ai/models/:id/test`  | `ai:model:test`   |

页面已放在 `vivy-react/src/pages/ai/model/index.tsx`，API 和类型位于 `src/apis/ai/model/`。复用现有岗位管理的 ProTable、DrawerForm、`useRequest`、DictTag 和权限按钮，已接入模块、菜单组件映射、按钮权限、`types/access.d.ts` 及独立 AI SQL。复制表单仅带入非敏感配置，密钥重新输入。

聊天选模用 Ant Design 的 Select/Dropdown 放入 Ant Design X Sender 的扩展区域，沿用会话级 `modelId`。这部分是普通模型目录请求和输入参数，与消息 Provider/parts 渲染分别衔接；后端由 Agent 模块读取模型连接信息、构造 DeepAgents 使用的 SDK 实例。

连接测试已在服务端读取已保存配置，允许测试停用模型，测试服务直接创建三种 SDK 实例并使用固定小型请求验证流式回复或工具调用；最多 30 秒、256 Token、温度 0、不重试，返回耗时、结果和分类错误，不回传请求头或凭据。参考项目没有实际测试实现，供应商实际模型的能力与用量仍需配置后确认。

### 密钥存储、更新和日志

1. 按用户要求，接口密钥以明文保存到 `secret_key`，模型模块只负责连接配置。
2. 创建时要求有效密钥；修改时省略 `secretKey` 或传 `null` 表示保留，提供非空新值表示替换，空字符串拒绝。编辑抽屉密钥框留空，提交时剔除空输入；不把“已配置”的展示文字当成真实密钥提交。
3. 密钥字段设置 TypeORM `select: false`，同时用明确的列表/详情白名单输出。服务端调用方显式读取密钥；聊天目录、消息和日志只使用所需展示字段。
4. 当前 `LogInterceptor` 会直接序列化 `request.body`。包含密钥的新增/修改接口需要将 `@Log` 的 `isSaveRequestData` 设为 `false`，保留操作人、动作和结果；模型测试错误与 Provider 日志也经过脱敏。

上述要求已落地。另增加模型 Controller 校验异常过滤器，避免现有全局校验过滤器记录原始请求体；测试日志同时禁用响应内容记录。

### 调用方构造模型与选模

模型模块通过 `ModelService.find(modelId)` 提供基础连接信息。连接测试在自己的私有方法中构造 SDK 实例，后续 Agent 模块自行设置参数并创建传给 `createDeepAgent` 的模型。参考适配器的地址映射仍可复用：

| 参考适配器      | 当前配置                                                                | Vivy 处理                                                                              |
| --------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `ChatOpenAI`    | `configuration.baseURL`、`useResponsesApi: false`、`streamUsage: false` | 可从 Chat Completions 兼容模式开始，接入企业网关或通义等兼容服务时逐项验证工具与流能力 |
| `ChatDeepSeek`  | `configuration.baseURL`、`streamUsage: false`                           | 保留原生适配器；验证所选模型的工具调用和历史 reasoning 兼容性                          |
| `ChatAnthropic` | `anthropicApiUrl`                                                       | 保留独立的地址映射，输出上限由调用方设置                                               |

三者使用模型配置中的 `modelCode/secretKey/baseUrl`，温度、输出上限、请求超时及重试由各调用方设置。模型表不保存调用参数。`streamUsage: false` 属于参考实现的兼容设置，PoC 确认实际用量事件；未返回用量时记录未知，不能当成零成本。

当前已实现按 ID 读取连接信息和启用模型目录。以下 Run、会话与历史语义在下一步由 Agent/Run 模块实现：

1. **新 Run 读取当前配置**：服务端根据 `modelId` 检查状态、允许范围和能力，再固定本次执行配置。前端只提交模型 ID；流式回复期间切换选项影响下一轮，不修改当前模型实例。
2. **记录本次调用**：Run 保存模型 ID、Provider、来源、模型名称/标识和实际调用参数。参考 Run 当前只关联 `modelAgentId`，模型删除时 `SET NULL`；由 Run 记录本次使用的信息，用于追溯，密钥只用于服务端调用。
3. **保留幂等回放与业务重试差异**：同一请求回放原 Run，不因模型后来停用而再次读取配置或调用模型；用户重试创建新 Run，采用当前选中的有效模型，并保留旧尝试、原输入和成功 checkpoint 起点。
4. **选模按会话隔离**：复用目录请求去重与旧响应失效逻辑；创建/连接阶段锁定选项，流式阶段可为下一轮选择。恢复时优先有效的会话选择、最近 Run 模型、Agent 默认模型；参考实现最后回退到目录第一项，Vivy 改为明确配置默认模型。无可用模型时展示提示并禁止发送。
5. **保留历史兼容适配**：借鉴 `adaptAgentModelHistory()`，已知不同 Provider 的助手消息仅在本次请求副本中保留文本和标准工具调用，去除专有 thinking 签名等字段；同 Provider 和没有来源元数据的历史当前保持原样。保留 checkpoint、工具关联、规划与工作文件；新增兼容网关时验证来源元数据和同适配器下不同服务的兼容性。
6. **启停、删除与运行解耦**：Agent 在新 Run 开始时检查模型状态，已启动 Run 使用自己的模型实例，停止走 Run 取消接口。引入模型引用后再检查删除限制；历史记录保留本次调用信息，不级联删除会话或消息。

后台 Worker、审批恢复阶段由执行入口读取所需连接信息；队列传递 Run ID。

### 迁移顺序与验证内容

1. 已完成基础模型连接表、管理 DTO/API 和权限菜单，接入 ProTable/DrawerForm；可选目录和服务端连接读取共用模型服务。
2. 已完成三种适配器的连接测试；实际聊天参数和 SDK 实例由后续 Agent 模块设计。
3. 下一步接入 Ant Design X 的会话选模、Agent/Run 调用组装、调用记录、业务重试和跨 Provider 历史适配。
4. 随知识库阶段补充 Embedding/Rerank 配置和索引绑定，再按连接复用、组织分配、配额等实际需求扩展。

如果后续需要导入参考项目已有配置数据，按上述字段映射导入，密钥重新填写；既有 ID 保留或建立映射。本轮只参考其源码设计，未读取或导出该项目的实际配置、凭据和业务数据。

落地时重点验证：管理列表/详情/日志不会泄露凭据；修改保留或替换密钥的语义；停用与删除阻止新运行但不破坏回放；三类 Provider 的流式工具调用与用量；换模、重试、历史工具链接与工作文件保留；会话切换时选模隔离；默认模型失效和无可用模型；旧 Run 的模型快照。参考 `runtime/model.test.ts` 已有历史适配用例，但本次没有运行这些测试或真实模型调用。

## 拟议模块、数据与协议

初期放在系统应用内部，按功能模块组织：

```text
vivy-modules/vivy-system/src/modules/ai/
  model/          模型连接配置与连接测试
  agent/          Agent 定义、运行组装与 Skills 配置
  conversation/   会话与消息
  run/            运行、幂等、取消、审批与恢复
  tool/           工具定义、授权及执行入口
  knowledge/      知识库、文档、切片与检索
  skill/          业务技能目录、版本与发布
  mcp/            MCP Provider 与外部工具接入

vivy-react/src/pages/ai/       聊天工作台与管理页面
vivy-react/src/apis/ai/        API、模型与流式适配
```

新增依赖放入实际使用的 workspace 包。多个应用确实需要共享时，再抽取公共契约或适配包。

第一阶段业务实体至少包括 AiModel、Conversation、Message、Run；Agent 定义、工具调用记录、知识库、Document、Chunk、Skill、MCP 配置和 Approval 按阶段增加。新增 Agent 资源 ID 可以评估 UUID，系统用户/部门 ID 与当前契约及 [BIGINT ID 评估](./bigint-id-review.md) 对齐，不在本任务中启动全仓 ID 迁移。

优先沿用参考实现的业务事件语义：

| 事件              | 含义                                                       |
| ----------------- | ---------------------------------------------------------- |
| `run.started`     | 已提交的 Run、用户消息和助手占位，客户端确认本轮启动       |
| `message.delta`   | 指定 messageId/partId 的正文增量                           |
| `reasoning.delta` | 可选的模型公开 reasoning 增量；不生成补充推理文本          |
| `message.part`    | 工具、规划、子任务等完整内容段快照                         |
| `run.finished`    | 已提交数据库的 Run、完整消息和会话，包含成功/失败/取消状态 |

RAG 引用、文件、图表和审批通过显式类型扩展 parts/事件并进行 Schema 校验；后续后台订阅再增加事件 ID、游标和协议版本。断开网络不视为成功终态，客户端取消请求与服务端取消 Run 分别设计。

管理 CRUD 沿用 `AjaxResult`；聊天使用独立 SSE 协议；MCP 使用协议规定的结果和错误。前端 X SDK、Nest 流式入口与 MCP 异常适配分别核对，不能把 HTTP 200 的业务错误当作调用成功。

## 企业级接入要求

- **统一身份与授权**：HTTP、MCP、后台 Worker 使用服务端确定的执行身份。现有权限守卫读取 handler 元数据；Agent 直接调用 Service 需要显式授权，Nest MCP 的执行上下文也需要适配当前守卫、CLS/SecurityContext、管道和异常过滤器。
- **实际数据范围**：列表、统计、详情、导出和写操作分别验证；RAG、引用下载、聊天历史、记忆和缓存都按所属用户与授权范围隔离。
- **本次运行上下文**：Agent/Run 模块记录本轮目标、模型与调用参数，页面切换不改变当前 Run。工具执行、审批恢复时仍重新核验当前访问权限。
- **可恢复状态**：请求幂等、会话互斥、部分结果保存、旧执行器写入限制、取消竞态、checkpoint 确认和终态事务进入第一版设计。
- **写入与审批**：明确审批状态、目标参数、审批人、有效期、续跑接口和写入幂等；工具重试或恢复需要考虑真实业务副作用。
- **运行治理**：设置步数、时间、并发和 Token/成本预算；保留 Run、工具、模型版本、用量和错误类型。日志、工具参数与 artifact 按字段控制脱敏、大小和保留期限，模型凭据留在后端。
- **效果评估**：从第一阶段建立允许/拒绝路径和固定任务样例，逐步验证工具选择、统计准确性、引用与检索质量、成功率、延迟和成本。

## 分阶段待办与第一版验收

### 已完成的记录与调研

- [x] 记录四项主要功能、学习目标与各阶段实现状态。
- [x] 核对本项目基础模块、依赖、权限与数据范围接入点。
- [x] 核对官方 Nest MCP、LangChain/LangGraph/DeepAgents 和 Ant Design X。
- [x] 阅读 canvas-agent 核心代码，整理已有能力、缺口、可复用设计和迁移差异。
- [x] 对照 X SDK 类型与 Bubble 接口，记录参考消息、parts、Run 和 SSE 的映射及适配边界。
- [x] 阅读参考模型配置全链路，记录字段、Provider 工厂、密钥处理、会话选模、配置快照及迁移顺序。

### 第一步：模型管理与连接测试

- [x] 新增独立 AI 根菜单（AI管理 → 模型管理 + 6 个权限按钮）、`ai_model` 表与增量菜单脚本。
- [x] 接入模型管理 CRUD、搜索/分页、启停、复制、脱敏目录和前后端权限。
- [x] 明文保存密钥，支持密钥保留/替换、日志与校验异常处理。
- [x] 锁定三种适配器 SDK，模型模块仅保存连接信息，调用参数由调用方设置。
- [x] 实现文本流/工具调用测试，验证超时、错误分类和未知用量。
- [x] 完成本轮精简后的单元测试、隔离 MySQL HTTP 测试、重复 SQL 导入、前后端构建和类型检查。
- [ ] 在现有环境执行 AI SQL、通过管理页面配置连接，验证真实模型与浏览器交互。

### 下一步：先做技术 PoC

- [ ] 继续锁定 DeepAgents、LangGraph、Ant Design X 等依赖，验证 NodeNext/ESM 与 Zod 协议构建。
- [ ] 选定聊天模型、Embedding/Rerank 候选、checkpoint 与向量存储。
- [ ] 在已完成模型基础上实现 Run 选模与快照闭环，验证所选真实模型的工具调用与流式兼容性。
- [ ] 用一个只读工具验证 HTTP Agent 与 MCP 的身份、权限、数据范围和拒绝路径。
- [ ] 验证 MCP 执行上下文、当前守卫/过滤器和 SSE 的认证及异常协议。
- [ ] 用 X SDK 自定义 Provider 展示正文、工具状态和服务端最终快照。
- [ ] 验证 SDK/业务消息 ID、占位去重、parts 顺序、Run 终态、业务停止和保留尝试的重试。
- [ ] 验证幂等、停止、断流、失败重试、checkpoint 缺失及迟到写入。

| 阶段                       | 交付内容                                                                                                           | 重点                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 第一步：模型基础（已完成） | 基础模型连接配置、三种适配器连接测试、模型目录、AI 菜单与初始化 SQL                                                | 模型配置、凭据与权限基础                |
| 1：聊天与数据工具          | 会话选模与模型快照、Ant Design X 工作台、单 Deep Agent、三个只读业务工具、Conversation/Message/Run、日志与基础恢复 | 模型调用、流式协议、授权和状态一致性    |
| 2：知识库                  | 文件处理队列、文档与切片、权限检索、来源引用、索引更新删除                                                         | RAG、Embedding、混合检索、Rerank 和评估 |
| 3：Skills 与 MCP           | 业务技能、固定模板任务、MCP Server/Client、组合分析                                                                | 按需加载、跨系统工具与能力复用          |
| 4：复杂与长任务            | 审批续跑、长期记忆、规划/子 Agent、隔离沙箱、后台 Worker、订阅恢复、持续评估                                       | Human-in-the-loop、恢复与任务协作       |

权限、数据隔离、幂等和基本观测从阶段 1 接入。阶段 4 是能力扩展，不表示基础控制延后实现。

第一版综合验收场景：**分析近七天登录失败情况 → 查询相关制度 → 按业务 Skill 的固定模板生成报告 → 展示统计、引用和结果文件；同一组受控查询工具通过 MCP 供外部客户端调用。**

预期范围为一个 Agent、三个只读业务工具、一个知识库、一项报告 Skill 和 MCP Server；审批、脚本沙箱、后台持续运行及跨会话记忆按后续阶段推进。

后续继续开发前，优先读取本文、参考模块的 `README.md`/`architecture.md` 与 `runtime/agent.ts`、`runtime/model.ts`、`runtime/checkpointer.ts`、`runtime/protocol.ts`、`services/models.ts`、`services/stream.ts`、`services/runs/`、`schemas.ts`、`state.ts`、`actions/stream.ts`、`stores/agent-session-store.ts`；模型管理还需读取参考仓库的 `src/db/schemas/model.ts` 和 `src/features/admin/model-agents/`。

## 资料与项目约定

- [Nest 官方 MCP 仓库](https://github.com/nestjs/mcp)与 [MCP 文档](https://docs.nestjs.com/mcp/overview)
- [官方 MCP TypeScript SDK v2](https://ts.sdk.modelcontextprotocol.io/v2/)与 [MCP 授权规范](https://modelcontextprotocol.io/specification/latest/basic/authorization)
- [LangChain / LangGraph / DeepAgents 的关系](https://docs.langchain.com/oss/javascript/concepts/products)
- [DeepAgents SDK](https://docs.langchain.com/oss/javascript/deepagents/overview)、[Skills](https://docs.langchain.com/oss/javascript/deepagents/skills)、[Agent Skills 规范](https://agentskills.io/specification)
- [LangGraph checkpointers](https://docs.langchain.com/oss/javascript/langgraph/checkpointers)与 [RedisSaver 要求](https://github.com/langchain-ai/langgraphjs/tree/main/libs/checkpoint-redis)
- [用户提供的 Ant Design X 站点](https://ant-design-x.antgroup.com/index-cn)、[组件总览](https://ant-design-x.antgroup.com/components/overview-cn)、[自定义 Chat Provider](https://ant-design-x.antgroup.com/x-sdks/chat-provider-custom-cn)、[XRequest](https://ant-design-x.antgroup.com/x-sdks/x-request-cn)
- [useXChat 的消息与状态接口](https://ant-design-x.antgroup.com/x-sdks/use-x-chat-cn)、[Bubble 的自定义内容与列表接口](https://ant-design-x.antgroup.com/components/bubble-cn)
- 项目 [本地开发](../development.md)、[系统权限](../back/common/security.md)、[数据权限](../back/common/datascope.md)、[异步上下文](../back/common/context.md)、[文件上传](../back/business/upload.md)

此文档是可继续更新的工作记录。实施后同步勾选待办、记录实际锁定版本、最终存储选择、验证命令与结果，避免将调研建议或参考项目能力写成 Vivy 已完成能力。
