# BIGINT ID 类型调整评估

评估日期：2026-11-25。源码基于提交 `bcd195a`；本地已安装依赖为 TypeORM 1.1.3、mysql2 3.24.6、NestJS 12.6.0。

本次整理必要性、可选方案、影响范围和验证要求。已经完成源码核对与依赖方法的最小复现，实际数据库最大 ID、线上数据和接口消费者尚未核查。

## 必要性与建议

当前数据库允许 64 位整数 ID，而实体、DTO、接口参数和前端模型普遍声明为 JavaScript `number`。JavaScript 的安全整数上限为 `9007199254740991`，MySQL 当前有符号 BIGINT 的上限为 `9223372036854775807`。两者的取值能力不一致。

建议通用二次开发框架采用：**数据库保留 BIGINT，ID 在后端类型、API JSON、会话和前端中使用规范十进制字符串。**

| 使用场景                                              | 更改的必要性                                                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 只使用安全范围内的 MySQL 自增 ID                      | 全量迁移不紧急；可以继续使用 number，但应明确范围、验证不安全输入，并确认真实库中的值也满足约定 |
| 接入雪花 ID、外部系统大 ID，或已存在超过安全范围的 ID | 需要完整处理 ID 链路；当前入口转换已经能够复现精度损失                                          |
| 作为通用后台框架持续新增业务                          | 值得在新增更多业务前统一 ID 契约，降低后续模块同时修改的成本                                    |

自增字段的声明不能证明实际数据一直处于安全范围。当前没有真实库证据表明已经发生数据损坏，也不能用初始化 SQL 的小 ID 判断所有运行环境都没有风险。

## 方案比较

| 方案                                      | 能力与代价                                                                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 保留 BIGINT，应用继续使用 number          | 改动较少，前提是整个 ID 生命周期受安全整数范围约束。仅使用 `@IsInt()` 不够，因为它会接受已经舍入但仍是整数的值                |
| 保留 BIGINT，ID 全链路改为 string         | 推荐方案。保留数据库容量与大 ID 兼容性；跨后端、会话、前端和生成器调整类型及边界，API 返回类型发生变化                        |
| BIGINT ID 列改为 INT，应用继续使用 number | 源码修改主要集中在实体与 SQL，但需要真实数据库 DDL 变更，主键及关联列同步，且 ID 容量收缩到 32 位。仅在确定不需要大 ID 时适用 |

数据库改为 INT 的方案不需要把下文 218 处 number 声明改为 string；下文的全量范围统计针对第二种方案。

TypeScript/JSON 中推荐使用字符串。JavaScript 原生 `bigint` 可用于内部精确计算或范围比较，但 `JSON.stringify({ id: 1n })` 默认会抛错，不适合作为接口和 Redis JSON 快照的直接字段类型。

## 已验证的实际问题

### 查询结果会随数值大小改变类型

[开发配置](../vivy-modules/vivy-system/src/config/config.development.yaml)和[生产配置](../vivy-modules/vivy-system/src/config/config.production.yaml)均为：

```yaml
supportBigNumbers: true
bigNumberStrings: false
```

调用本地 mysql2 的 BIGINT 文本解析方法得到：

| 数据库值              | 当前解析结果   | 开启 bigNumberStrings 后 |
| --------------------- | -------------- | ------------------------ |
| `1`                   | `number: 1`    | `string: "1"`            |
| `9007199254740991`    | number，值完整 | string，值完整           |
| `9007199254740992`    | string，值完整 | string，值完整           |
| `9007199254740993`    | string，值完整 | string，值完整           |
| `9223372036854775807` | string，值完整 | string，值完整           |

因此，当前驱动已经保护了 BIGINT 查询的大整数精度。问题是应用声明为 number、运行时可能得到 string，随后其他转换又可能丢失精度。

### 单 ID 和批量 ID 在入口被数值化

项目的[全局 ValidationPipe](../vivy-common/vivy-common-core/src/pipes/validation.pipe.ts)启用 `transform: true`，通过[全局管道注册](../vivy-common/vivy-common-core/src/pipes/global.ts)接入应用。Controller 中的 `@Param(...) id: number` 会按 Number 元类型转换；例如[用户 Controller](../vivy-modules/vivy-system/src/modules/system/user/user.controller.ts)同时存在单 ID 数值类型和批量 `ParseArrayPipe({ items: Number })`。

调用本地 NestJS 管道得到：

```text
单 ID 输入： "9007199254740993"
实际结果：    9007199254740992

批量输入：   "9007199254740992,9007199254740993"
实际结果：   [9007199254740992, 9007199254740992]
```

两个不同 ID 会变成相同的数值。`@IsInt()` 仍会接受舍入后的整数。把舍入结果再 `String(...)` 不能恢复原 ID。

此外，[AuthGuard](../vivy-common/vivy-common-security/src/guards/auth.guard.ts)对网关传入的 `user_id` 请求头使用 `Number(userId)`，该入口也需要同步处理。

### ORM 的字符串自增 ID 返回值需要先处理

当前 TypeORM MySQL driver 的 `createGeneratedMap` 使用：

```ts
value = insertResult.insertId + entityIndex
```

对本地已安装驱动方法进行最小复现：

```text
insertId 为 number 42，entityIndex 为 0
generatedId 为 number 42

insertId 为 string "9007199254740993"，entityIndex 为 0
generatedId 为 string "90071992547409930"

insertId 为 string "9007199254740993"，entityIndex 为 1
generatedId 为 string "90071992547409931"
```

后两项发生了字符串拼接，正确的第一行 ID 应是 `"9007199254740993"`，第二行应是 `"9007199254740994"`。

mysql2 对小自增 ID 的插入结果仍可能返回 number，即使开启 `bigNumberStrings`；因此还需统一新增结果的 ID 类型。超过安全范围时，当前配置也可能收到字符串 insertId，这个问题并非只在切换配置后才存在。

[用户新增](../vivy-modules/vivy-system/src/modules/system/user/user.service.ts)和[角色新增](../vivy-modules/vivy-system/src/modules/system/role/role.service.ts)分别从 `result.identifiers[0]` 取得 userId/roleId，并立即写入关联表，这是必须核验的业务路径。

实施前先确定依赖修复方案：核实可用的官方修复或升级，或采用可维护的补丁、可靠读取原始新增 ID 的方式。所有替代方式都要确保使用同一事务连接，并验证单条和批量新增。此次只复现依赖方法与业务调用链，尚未进行真实 MySQL 事务联调。

### 类型变化会改变现有业务分支

| 当前写法                                     | 更改为字符串后的影响                                                               | 涉及位置                              |
| -------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| `record.userId === 1`、`record.roleId === 1` | `"1" === 1` 为 false，管理员按钮和勾选限制需要同步                                 | 用户、角色列表页面                    |
| `data.parentId                               |                                                                                    | undefined`                            | 数字 0 原来转为 undefined；字符串 `"0"` 会保留，根节点表单初始化行为变化 | 部门、菜单 UpdateForm |
| `if (dept.parentId)`                         | `"0"` 为真，可能进入查询不存在的父部门 0 的分支                                    | DeptService 的新增和更新              |
| `isEmpty(userId/roleId/deptId)`              | lodash 对数字 123 返回 true，对字符串 `"123"` 返回 false，范围校验的执行分支会变化 | UserService、RoleService、DeptService |
| Map、选中项、ID 集合比较                     | 数字和字符串作为 key 不相等，需要保证来源一致                                      | 树结构、表格选择、角色和部门选择      |

上述逻辑需要按业务含义改成明确的空值和零值判断，再验证实际可访问记录。

[IdentityUtils](../vivy-common/vivy-common-core/src/utils/security/identity.utils.ts)当前通过 `Number(id)` 与超级 ID 比较，字符串 `"1"` 仍能被识别为管理员。需要调整的是参数契约与转换约定；不能把它描述为“切换字符串后管理员身份判断必然失效”。

## 更改范围

### 直接类型声明

按有效 TypeScript AST 声明统计，排除注释、公共包 lib 构建产物、测试文件、生成器自身 INT 主键和请求追踪 ID：

| 分类                           | 文件数 | 显式 ID 类型声明数 |
| ------------------------------ | -----: | -----------------: |
| 后端实体                       |     18 |                 26 |
| 后端 Controller/Service/DTO/VO |     30 |                111 |
| 公共包身份与请求类型           |      6 |                 10 |
| 前端 API/模型/声明             |     23 |                 61 |
| 前端页面/组件                  |     10 |                 10 |
| 合计                           |     87 |                218 |

这些声明包含 `number`、`number[]`、`number | string`、`number | number[]` 等 ID 类型。每个字段、参数或返回值算一处，不按 number 关键字数量重复计算。

这是直接声明的确定数量，不是最终提交的文件数。加上驱动配置、无显式 ID 注解的运行逻辑、生成器模板、公共校验工具、测试和文档，整体仍可按 **约 100～110 个文件** 估算，最终取决于依赖修复和输入兼容方案。

### 额外需要处理或核验的内容

| 范围           | 具体工作                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| 数据库驱动配置 | 开发和生产统一 `supportBigNumbers / bigNumberStrings`，验证普通查询、原始查询、新增结果和关联写入         |
| 实体及 DTO     | BIGINT 列继续映射 BIGINT，ID 属性改为 string；ID 的 `@IsInt()` 改为符合字符串 ID 契约的校验；数组逐项校验 |
| 参数边界       | 单 ID、逗号分隔批量 ID、查询筛选、请求体和网关身份统一处理，避免先 Number 再 String                       |
| 共享身份类型   | SysUser、SysLoginUser、数据范围 roleId、SecurityContext、Express Request、JWT 字段同步                    |
| 新增 ID 取值   | 修复或避开错误的 generated map，统一小 ID 和大 ID 的新增返回类型，核验用户/角色关联                       |
| 业务逻辑       | 超级 ID 比较、零值与空值判断、唯一性排除自身、范围检查、父子关系和选中项比较                              |
| 前端           | API 参数和模型、全局用户声明、删除/批量操作、部门筛选、管理员按钮与勾选、部门/菜单表单初始化              |
| 数据范围 SQL   | 检查 userId、deptId、roleId 及默认部门 0 的表示；服务端拼入 SQL 的 ID 必须来自已经规范化的身份数据        |
| Redis 与队列   | 明确旧会话、仍携带数值 ID 的缓存及已有 Bull 任务数据的切换方式，避免新代码消费旧格式                      |
| 文档及测试     | 同步 ID 示例与测试夹具，增加能识别精度丢失、分支变化和关联写入错误的回归验证                              |

推荐 ID 契约为正整数的规范十进制字符串，并按当前有符号 BIGINT 校验上界。父节点等确实需要哨兵值的字段允许 `"0"`；可选字段明确 undefined/null 的语义。若需要兼容旧请求，只将安全整数 number 规范化为 string，拒绝不安全的 number，避免长期依赖混合类型。

### 生成器需要同步类型输出

当前生成器会将 BIGINT 放入数字类型组，导入字段时写入 `tslangType = number`。此外，部分 API 和页面模板硬编码了 number，批量 Controller 模板硬编码 `items: Number`。

需处理或核验：

- [GenConstants](../vivy-modules/vivy-system/src/modules/gen/utils/gen.constants.ts)：数字类型组与 ID 类型约定。
- [GenUtils](../vivy-modules/vivy-system/src/modules/gen/utils/gen.utils.ts)：新导入字段的 TypeScript 类型及控件默认值。
- 已保存的 `gen_table_column.tslang_type`：核对既有生成配置，不能只更新新导入字段的默认值。
- [Nest Controller 模板](../vivy-modules/vivy-system/src/modules/gen/template/nest/[name].controller.hbs)：批量 ID 解析方式。
- [Nest 实体模板](../vivy-modules/vivy-system/src/modules/gen/template/nest/entities/[name].entity.hbs)：ID 校验声明与生成类型一致。
- [React API 模板](../vivy-modules/vivy-system/src/modules/gen/template/react/apis/index.hbs)及[React 页面模板](../vivy-modules/vivy-system/src/modules/gen/template/react/index.hbs)：消除 ID 参数的硬编码 number。

生成器自身的 `tableId / columnId` 是 INT 主键，保留其数值类型。这部分工作是让现有生成输出符合 ID 契约，AI 接入方案可独立设计。Mapper/XML 只在实际使用的模块中核验参数兼容。

### BIGINT 数量字段单独确定

当前 BIGINT 共 27 列，其中 26 列是主键或关联 ID，另一列是 `sys_file.file_size`。

开启 `bigNumberStrings` 会影响 fileSize 的读取。若文件大小有明确的安全上限，可保留 number，并在读取转换和写入校验中落实这个上限；若要求完整表达 BIGINT 取值范围，则使用 string，并调整消费者。分页、排序、计数和时间戳等字段继续按各自的业务数值类型处理。

## 数据库字段清单

[初始化 SQL](../sql/vivy-nest-admin.sql)涉及 18 个 BIGINT 表，26 个 ID 列和 1 个数量列：

| 表              | BIGINT ID 列           | 其他 BIGINT 列                      |
| --------------- | ---------------------- | ----------------------------------- |
| `sys_dept`      | `dept_id`、`parent_id` |                                     |
| `sys_menu`      | `menu_id`、`parent_id` |                                     |
| `sys_post`      | `post_id`              |                                     |
| `sys_role`      | `role_id`              |                                     |
| `sys_role_dept` | `role_id`、`dept_id`   |                                     |
| `sys_role_menu` | `role_id`、`menu_id`   |                                     |
| `sys_user`      | `user_id`、`dept_id`   |                                     |
| `sys_user_post` | `user_id`、`post_id`   |                                     |
| `sys_user_role` | `user_id`、`role_id`   |                                     |
| `sys_dict_type` | `dict_id`              |                                     |
| `sys_dict_data` | `dict_id`              |                                     |
| `sys_config`    | `config_id`            |                                     |
| `sys_notice`    | `notice_id`            |                                     |
| `sys_login_log` | `login_id`             |                                     |
| `sys_oper_log`  | `oper_id`              |                                     |
| `sys_job`       | `job_id`               |                                     |
| `sys_job_log`   | `job_log_id`、`job_id` |                                     |
| `sys_file`      | `file_id`              | `file_size`：数量字段，单独确定类型 |

选择保留 BIGINT 的方案时，这 26 个 ID 列通常无需改数据库存储类型，也无需重编号。需要确认真实库结构与最大值，以及既有生成配置、缓存和队列的切换。

实施前的只读数据核查应使用字符串结果，例如：

```sql
SELECT CAST(MAX(user_id) AS CHAR) AS max_user_id FROM sys_user;
```

按上表核查所有 ID 列，并检查自增值和实际 ID 来源。选择 INT 方案时，还需分别确认现有值与未来容量满足所选择的 signed/unsigned INT 范围。

## 实施顺序与验收

1. 明确 ID 字符串契约、零值/空值、是否兼容安全 number 输入；先验证并确定 ORM 新增 ID 的可靠处理方式。
2. 完成公共类型、校验工具、配置和后端业务链路，核对用户/角色新增关联以及权限、数据范围行为。
3. 同步前端 API、页面和表单，更新生成器输出及既有字段配置；编制缓存、会话和队列的切换步骤。
4. 对类型改动运行公共包构建、受影响后端与前端检查，以及测试类型检查；对下面的真实行为执行回归，再安排前后端同步发布。

| 行为             | 验收目标                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 安全边界和最大值 | `"1"`、`"9007199254740991"`、`"9007199254740992"`、`"9007199254740993"`、BIGINT 上限均保持完整；超上限或非法格式被拒绝 |
| 单 ID 与批量 ID  | 相邻大 ID 不合并；详情、编辑、删除与批量操作命中正确记录                                                               |
| 新增和关联       | 小 ID、大 ID、单条与批量新增的结果类型正确；用户角色、用户岗位和角色菜单关联使用真实生成 ID                            |
| 树与表单         | 根节点 0、无父节点、已有父节点及编辑初始化语义一致                                                                     |
| 权限与数据范围   | 超级用户/角色识别、普通用户、范围内外 ID、部门/本人范围及批量混合目标行为正确                                          |
| 切换后的状态     | 旧会话、缓存及既有任务数据按既定方案处理，新请求不混用 ID 类型                                                         |
| 文件大小         | 读取、展示、上传记录及上限校验满足选定的数量字段契约                                                                   |
| 生成输出         | BIGINT ID 的实体、接口、API、页面和批量解析一致；INT 及普通数量字段仍遵循其自身类型                                    |

本次已经执行源码 AST 统计、SQL 字段核对、mysql2 解析、Nest 管道、TypeORM generated map、JSON 序列化及 lodash/零值语义的最小复现。未进行真实 MySQL/Redis、完整 HTTP 链路或 UI 联调，也未修改业务实现、数据库配置或现有数据。

## 逐文件声明清单

以下 87 个源码文件是 ID 类型替换的直接范围；公共包 `lib` 声明由构建重新生成。

### 后端实体

18 个文件，26 处声明。后端业务路径相对于 `vivy-modules/vivy-system/src/modules`，公共包路径相对于 `vivy-common`，前端路径相对于 `vivy-react`。

| 文件                                                                                                                                             | 声明数 |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -----: |
| [file/file/entities/sys-file.entity.ts](../vivy-modules/vivy-system/src/modules/file/file/entities/sys-file.entity.ts)                           |      1 |
| [monitor/job/entities/sys-job-log.entity.ts](../vivy-modules/vivy-system/src/modules/monitor/job/entities/sys-job-log.entity.ts)                 |      2 |
| [monitor/job/entities/sys-job.entity.ts](../vivy-modules/vivy-system/src/modules/monitor/job/entities/sys-job.entity.ts)                         |      1 |
| [monitor/login-log/entities/sys-login-log.entity.ts](../vivy-modules/vivy-system/src/modules/monitor/login-log/entities/sys-login-log.entity.ts) |      1 |
| [monitor/oper-log/entities/sys-oper-log.entity.ts](../vivy-modules/vivy-system/src/modules/monitor/oper-log/entities/sys-oper-log.entity.ts)     |      1 |
| [system/config/entities/sys-config.entity.ts](../vivy-modules/vivy-system/src/modules/system/config/entities/sys-config.entity.ts)               |      1 |
| [system/dept/entities/sys-dept.entity.ts](../vivy-modules/vivy-system/src/modules/system/dept/entities/sys-dept.entity.ts)                       |      2 |
| [system/dict/entities/sys-dict-data.entity.ts](../vivy-modules/vivy-system/src/modules/system/dict/entities/sys-dict-data.entity.ts)             |      1 |
| [system/dict/entities/sys-dict-type.entity.ts](../vivy-modules/vivy-system/src/modules/system/dict/entities/sys-dict-type.entity.ts)             |      1 |
| [system/menu/entities/sys-menu.entity.ts](../vivy-modules/vivy-system/src/modules/system/menu/entities/sys-menu.entity.ts)                       |      2 |
| [system/notice/entities/sys-notice.entity.ts](../vivy-modules/vivy-system/src/modules/system/notice/entities/sys-notice.entity.ts)               |      1 |
| [system/post/entities/sys-post.entity.ts](../vivy-modules/vivy-system/src/modules/system/post/entities/sys-post.entity.ts)                       |      1 |
| [system/role/entities/sys-role-dept.entity.ts](../vivy-modules/vivy-system/src/modules/system/role/entities/sys-role-dept.entity.ts)             |      2 |
| [system/role/entities/sys-role-menu.entity.ts](../vivy-modules/vivy-system/src/modules/system/role/entities/sys-role-menu.entity.ts)             |      2 |
| [system/role/entities/sys-role.entity.ts](../vivy-modules/vivy-system/src/modules/system/role/entities/sys-role.entity.ts)                       |      1 |
| [system/user/entities/sys-user-post.entity.ts](../vivy-modules/vivy-system/src/modules/system/user/entities/sys-user-post.entity.ts)             |      2 |
| [system/user/entities/sys-user-role.entity.ts](../vivy-modules/vivy-system/src/modules/system/user/entities/sys-user-role.entity.ts)             |      2 |
| [system/user/entities/sys-user.entity.ts](../vivy-modules/vivy-system/src/modules/system/user/entities/sys-user.entity.ts)                       |      2 |

### 后端 Controller/Service/DTO/VO

30 个文件，111 处声明。后端业务路径相对于 `vivy-modules/vivy-system/src/modules`，公共包路径相对于 `vivy-common`，前端路径相对于 `vivy-react`。

| 文件                                                                                                                         | 声明数 |
| ---------------------------------------------------------------------------------------------------------------------------- | -----: |
| [auth/login/login.controller.ts](../vivy-modules/vivy-system/src/modules/auth/login/login.controller.ts)                     |      1 |
| [auth/login/login.service.ts](../vivy-modules/vivy-system/src/modules/auth/login/login.service.ts)                           |      1 |
| [monitor/job/dto/job-log.dto.ts](../vivy-modules/vivy-system/src/modules/monitor/job/dto/job-log.dto.ts)                     |      1 |
| [monitor/job/job-log.controller.ts](../vivy-modules/vivy-system/src/modules/monitor/job/job-log.controller.ts)               |      1 |
| [monitor/job/job-log.service.ts](../vivy-modules/vivy-system/src/modules/monitor/job/job-log.service.ts)                     |      1 |
| [monitor/job/job.controller.ts](../vivy-modules/vivy-system/src/modules/monitor/job/job.controller.ts)                       |      4 |
| [monitor/job/job.service.ts](../vivy-modules/vivy-system/src/modules/monitor/job/job.service.ts)                             |      4 |
| [monitor/online-user/vo/online-user.vo.ts](../vivy-modules/vivy-system/src/modules/monitor/online-user/vo/online-user.vo.ts) |      1 |
| [system/config/config.controller.ts](../vivy-modules/vivy-system/src/modules/system/config/config.controller.ts)             |      3 |
| [system/config/config.service.ts](../vivy-modules/vivy-system/src/modules/system/config/config.service.ts)                   |      4 |
| [system/dept/dept.controller.ts](../vivy-modules/vivy-system/src/modules/system/dept/dept.controller.ts)                     |      3 |
| [system/dept/dept.service.ts](../vivy-modules/vivy-system/src/modules/system/dept/dept.service.ts)                           |      6 |
| [system/dict/dict-data.controller.ts](../vivy-modules/vivy-system/src/modules/system/dict/dict-data.controller.ts)           |      3 |
| [system/dict/dict-data.service.ts](../vivy-modules/vivy-system/src/modules/system/dict/dict-data.service.ts)                 |      5 |
| [system/dict/dict-type.controller.ts](../vivy-modules/vivy-system/src/modules/system/dict/dict-type.controller.ts)           |      3 |
| [system/dict/dict-type.service.ts](../vivy-modules/vivy-system/src/modules/system/dict/dict-type.service.ts)                 |      5 |
| [system/menu/menu.controller.ts](../vivy-modules/vivy-system/src/modules/system/menu/menu.controller.ts)                     |      3 |
| [system/menu/menu.service.ts](../vivy-modules/vivy-system/src/modules/system/menu/menu.service.ts)                           |      7 |
| [system/notice/notice.controller.ts](../vivy-modules/vivy-system/src/modules/system/notice/notice.controller.ts)             |      3 |
| [system/notice/notice.service.ts](../vivy-modules/vivy-system/src/modules/system/notice/notice.service.ts)                   |      3 |
| [system/post/post.controller.ts](../vivy-modules/vivy-system/src/modules/system/post/post.controller.ts)                     |      3 |
| [system/post/post.service.ts](../vivy-modules/vivy-system/src/modules/system/post/post.service.ts)                           |      6 |
| [system/role/dto/role.dto.ts](../vivy-modules/vivy-system/src/modules/system/role/dto/role.dto.ts)                           |      3 |
| [system/role/role.controller.ts](../vivy-modules/vivy-system/src/modules/system/role/role.controller.ts)                     |      4 |
| [system/role/role.service.ts](../vivy-modules/vivy-system/src/modules/system/role/role.service.ts)                           |      9 |
| [system/role/vo/role.vo.ts](../vivy-modules/vivy-system/src/modules/system/role/vo/role.vo.ts)                               |      2 |
| [system/user/dto/user.dto.ts](../vivy-modules/vivy-system/src/modules/system/user/dto/user.dto.ts)                           |      5 |
| [system/user/user.controller.ts](../vivy-modules/vivy-system/src/modules/system/user/user.controller.ts)                     |      3 |
| [system/user/user.service.ts](../vivy-modules/vivy-system/src/modules/system/user/user.service.ts)                           |     12 |
| [system/user/vo/user.vo.ts](../vivy-modules/vivy-system/src/modules/system/user/vo/user.vo.ts)                               |      2 |

### 公共包身份与请求类型

6 个文件，10 处声明。后端业务路径相对于 `vivy-modules/vivy-system/src/modules`，公共包路径相对于 `vivy-common`，前端路径相对于 `vivy-react`。

| 文件                                                                                                                                    | 声明数 |
| --------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| [vivy-common-core/src/class/sys-login-user.ts](../vivy-common/vivy-common-core/src/class/sys-login-user.ts)                             |      2 |
| [vivy-common-core/src/class/sys-user.ts](../vivy-common/vivy-common-core/src/class/sys-user.ts)                                         |      2 |
| [vivy-common-core/src/context/security.context.ts](../vivy-common/vivy-common-core/src/context/security.context.ts)                     |      1 |
| [vivy-common-core/src/types/express.d.ts](../vivy-common/vivy-common-core/src/types/express.d.ts)                                       |      1 |
| [vivy-common-core/src/utils/security/identity.utils.ts](../vivy-common/vivy-common-core/src/utils/security/identity.utils.ts)           |      3 |
| [vivy-common-security/src/interfaces/jwt-token.interface.ts](../vivy-common/vivy-common-security/src/interfaces/jwt-token.interface.ts) |      1 |

### 前端 API/模型/声明

23 个文件，61 处声明。后端业务路径相对于 `vivy-modules/vivy-system/src/modules`，公共包路径相对于 `vivy-common`，前端路径相对于 `vivy-react`。

| 文件                                                                                         | 声明数 |
| -------------------------------------------------------------------------------------------- | -----: |
| [src/apis/file/model.ts](../vivy-react/src/apis/file/model.ts)                               |      1 |
| [src/apis/monitor/job/index.ts](../vivy-react/src/apis/monitor/job/index.ts)                 |      4 |
| [src/apis/monitor/job/model.ts](../vivy-react/src/apis/monitor/job/model.ts)                 |      2 |
| [src/apis/monitor/login-log/model.ts](../vivy-react/src/apis/monitor/login-log/model.ts)     |      1 |
| [src/apis/monitor/online-user/model.ts](../vivy-react/src/apis/monitor/online-user/model.ts) |      1 |
| [src/apis/monitor/oper-log/model.ts](../vivy-react/src/apis/monitor/oper-log/model.ts)       |      1 |
| [src/apis/system/config/index.ts](../vivy-react/src/apis/system/config/index.ts)             |      3 |
| [src/apis/system/config/model.ts](../vivy-react/src/apis/system/config/model.ts)             |      1 |
| [src/apis/system/dept/index.ts](../vivy-react/src/apis/system/dept/index.ts)                 |      3 |
| [src/apis/system/dept/model.ts](../vivy-react/src/apis/system/dept/model.ts)                 |      2 |
| [src/apis/system/dict/index.ts](../vivy-react/src/apis/system/dict/index.ts)                 |      6 |
| [src/apis/system/dict/model.ts](../vivy-react/src/apis/system/dict/model.ts)                 |      2 |
| [src/apis/system/menu/index.ts](../vivy-react/src/apis/system/menu/index.ts)                 |      3 |
| [src/apis/system/menu/model.ts](../vivy-react/src/apis/system/menu/model.ts)                 |      2 |
| [src/apis/system/notice/index.ts](../vivy-react/src/apis/system/notice/index.ts)             |      3 |
| [src/apis/system/notice/model.ts](../vivy-react/src/apis/system/notice/model.ts)             |      1 |
| [src/apis/system/post/index.ts](../vivy-react/src/apis/system/post/index.ts)                 |      3 |
| [src/apis/system/post/model.ts](../vivy-react/src/apis/system/post/model.ts)                 |      1 |
| [src/apis/system/role/index.ts](../vivy-react/src/apis/system/role/index.ts)                 |      4 |
| [src/apis/system/role/model.ts](../vivy-react/src/apis/system/role/model.ts)                 |      6 |
| [src/apis/system/user/index.ts](../vivy-react/src/apis/system/user/index.ts)                 |      3 |
| [src/apis/system/user/model.ts](../vivy-react/src/apis/system/user/model.ts)                 |      5 |
| [types/user.d.ts](../vivy-react/types/user.d.ts)                                             |      3 |

### 前端页面/组件

10 个文件，10 处声明。后端业务路径相对于 `vivy-modules/vivy-system/src/modules`，公共包路径相对于 `vivy-common`，前端路径相对于 `vivy-react`。

| 文件                                                                                         | 声明数 |
| -------------------------------------------------------------------------------------------- | -----: |
| [src/pages/monitor/job/index.tsx](../vivy-react/src/pages/monitor/job/index.tsx)             |      1 |
| [src/pages/system/config/index.tsx](../vivy-react/src/pages/system/config/index.tsx)         |      1 |
| [src/pages/system/dept/index.tsx](../vivy-react/src/pages/system/dept/index.tsx)             |      1 |
| [src/pages/system/dict/$type/index.tsx](../vivy-react/src/pages/system/dict/$type/index.tsx) |      1 |
| [src/pages/system/dict/index.tsx](../vivy-react/src/pages/system/dict/index.tsx)             |      1 |
| [src/pages/system/menu/index.tsx](../vivy-react/src/pages/system/menu/index.tsx)             |      1 |
| [src/pages/system/notice/index.tsx](../vivy-react/src/pages/system/notice/index.tsx)         |      1 |
| [src/pages/system/post/index.tsx](../vivy-react/src/pages/system/post/index.tsx)             |      1 |
| [src/pages/system/role/index.tsx](../vivy-react/src/pages/system/role/index.tsx)             |      1 |
| [src/pages/system/user/index.tsx](../vivy-react/src/pages/system/user/index.tsx)             |      1 |
