# 后端实现

在修改实体、DTO、接口、数据访问或业务约束时读取本文件。

## 选择实际范例

| 需要的能力                      | 当前源码                                                                                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 普通 CRUD、唯一性、关联删除限制 | [岗位 Service](../../../../vivy-modules/vivy-system/src/modules/system/post/post.service.ts)、[Controller](../../../../vivy-modules/vivy-system/src/modules/system/post/post.controller.ts) |
| 实体与 DTO 映射                 | [岗位实体](../../../../vivy-modules/vivy-system/src/modules/system/post/entities/sys-post.entity.ts)、[DTO](../../../../vivy-modules/vivy-system/src/modules/system/post/dto/post.dto.ts)   |
| 简单内容业务                    | [通知公告](../../../../vivy-modules/vivy-system/src/modules/system/notice)                                                                                                                  |
| 多表事务、关联集合              | [用户 Service](../../../../vivy-modules/vivy-system/src/modules/system/user/user.service.ts)                                                                                                |
| 范围查询的构建与复用            | [用户 Service](../../../../vivy-modules/vivy-system/src/modules/system/user/user.service.ts) 的 `dsUserQueryBuilder`                                                                        |

范例用于确认结构、调用协议和项目能力；业务规则仍由当前需求决定。

## 实体与字段

- 新表按当前业务确定表名、主键、长度、精度、空值、默认值和索引；已有表以其定义为基础，不根据模板另造一份字段。
- 对照数据库列名与实体属性名，例如 `post_id` 对应 `postId`；保留明确的 `@Column({ name })` 映射。
- 适用时复用 [BaseBusinessEntity](../../../../vivy-common/vivy-common-core/src/entities/base-business.entity.ts)。它包含审计字段，但不包含业务数据范围需要的 `dept_id`、`user_id`。
- 状态、字典值沿用实际字符串枚举；主键、日期、decimal 等类型以现有实体和业务精度为准。
- 开发配置当前启用 `synchronize` 和 `autoLoadEntities`。映射已有表时核对完整结构；仅为关联检查注册部分列的实体，需避免触发该表的自动结构同步，可采用实体级 `synchronize: false` 或复用已有映射。新业务实体与建表 SQL 仍按需求保持一致。
- 创建者、更新者及需要的归属信息从服务端上下文取得。表单提供的主键或审计字段不直接进入 insert/update。

## DTO 与接口

- 查询 DTO 复用 [PaginateDto](../../../../vivy-common/vivy-common-core/src/dto/paginate.dto.ts) 的 `page`、`limit`；数值筛选、枚举、日期和数组按需要添加转换与校验。
- [全局 ValidationPipe](../../../../vivy-common/vivy-common-core/src/pipes/validation.pipe.ts) 使用 `transform: true`、`whitelist: true`。`@Allow()` 仅让字段通过白名单，不会验证其业务类型或取值。
- `OmitType`、`PickType`、`PartialType` 按真实创建/修改协议选用；复用实体时检查继承的校验规则和可写字段。更新是否部分提交由接口约定决定。
- 路由 ID、批量 ID 和范围参数需能被实际转换、校验；TypeScript 的 `number` 注解本身不等于完整的运行时校验。
- 沿用 `AjaxResult.success`、`AjaxResult.error` 和 `ServiceException`。保持已存在的路径、HTTP 方法和权限码，除非任务要求改变。
- 新业务路由通常使用复数资源名。`options`、`export` 等固定路径与 `:id` 的顺序和匹配需检查，且只实现需求中的操作。

## 数据访问

- 普通 insert/update/delete、简单筛选用 Repository；连表、组合条件、聚合或范围查询用 QueryBuilder。
- QueryBuilder 参数使用绑定值；可选查询条件要排除未提供的值，同时保留合法的 `0`、`false` 和空字符串语义。排序字段若来自请求，映射到允许的列。
- 列表沿用 `nestjs-typeorm-paginate`，返回 `items`、`meta`；排序明确且稳定。关联查询核验分页数量与重复行。
- 详情和更新先明确不存在记录的业务结果，避免在空记录上访问属性。
- 需要数据范围时复用受约束的查询构建函数；列表过滤不会自动保护独立的详情、导出、update 或 delete。具体做法见 [数据范围](../../vivy-auth-datascope/references/data-scope.md)。

## 业务约束

- 唯一性检查在更新时排除自身 ID。需求要求持久化唯一性时，同时考虑数据库唯一约束与并发冲突的业务错误处理；预查询本身不能保证并发唯一。
- 删除限制基于真实关联数据。批量操作先检查所有目标的存在性、权限和关联约束，再按约定执行；不能先删部分记录，再发现其余目标被禁止。
- 多表写入使用同一 `DataSource.transaction` 回调内的 manager。事务内继续调用外部 Repository，可能使部分写入脱离事务。
- 状态流转、归属转移、主从关联和删除策略依据当前业务，不自动附加软删除、级联删除或工作流。

## 模块与资源

参考 [PostModule](../../../../vivy-modules/vivy-system/src/modules/system/post/post.module.ts)：注册所用实体、Controller、Service 和实际依赖；需要跨模块使用的 provider 才导出。再检查目标业务父模块是否导入新模块。

新模块默认不创建 Mapper/XML。明确需要 XML 时，核对 namespace、statement id、参数处理、provider 注册、运行时 assets 和声明生成流程。参见 [MyBatis 插件](../../../../vivy-common/vivy-plugin-mybatis/src/mybatis.service.ts)；`getSql` 返回拼装后的 SQL，不能把模板替换直接当成数据库预编译绑定。声明文件由插件生成，项目接入见 [integration.md](integration.md)。
