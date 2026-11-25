# 认证链路

在登录、JWT、守卫、公开/内部接口或请求上下文问题中读取本文件。

## 从当前源码追踪

| 环节                     | 当前源码                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 登录与登录后接口         | [LoginController](../../../../vivy-modules/vivy-system/src/modules/auth/login/login.controller.ts)、[LoginService](../../../../vivy-modules/vivy-system/src/modules/auth/login/login.service.ts)                                                                                     |
| 守卫注册                 | [SecurityModule](../../../../vivy-common/vivy-common-security/src/security.module.ts)                                                                                                                                                                                                |
| 身份、内部来源与功能权限 | [AuthGuard](../../../../vivy-common/vivy-common-security/src/guards/auth.guard.ts)、[InnerAuthGuard](../../../../vivy-common/vivy-common-security/src/guards/inner-auth.guard.ts)、[RequireAuthGuard](../../../../vivy-common/vivy-common-security/src/guards/require-auth.guard.ts) |
| JWT 与 Redis 会话        | [TokenService](../../../../vivy-common/vivy-common-security/src/services/token.service.ts)                                                                                                                                                                                           |
| 请求身份上下文           | [SecurityContext](../../../../vivy-common/vivy-common-core/src/context/security.context.ts)、[RequestContext](../../../../vivy-common/vivy-common-core/src/context/request.context.ts)                                                                                               |

## 当前请求流程

1. LoginService 验证账户/密码及状态，组装 `sysUser`、`roles`、`permissions`、`scopes`。
2. TokenService 创建随机 `userSk`，将登录用户快照存入 Redis；JWT 包含会话标识及基础身份信息。
3. 非公开请求经 AuthGuard 检查 Token、JWT 验证结果和 Redis 会话存在性，向请求对象附加登录信息并按需要续期。
4. SecurityModule 当前注册顺序是 AuthGuard → InnerAuthGuard → RequireAuthGuard。后续权限逻辑从请求的 SecurityContext 读取会话身份。
5. RequestContext 基于 `nestjs-cls` 保存当前请求；不要用全局变量或单例可变字段保存“当前用户”。

有效 JWT 不等于有效登录：Redis 会话删除或缺失后仍应拒绝访问。刷新 Redis TTL 不会重新签发 JWT；JWT 的过期设置还需检查实际 JwtModule 配置。

## 公开与内部入口

- [Public](../../../../vivy-common/vivy-common-security/src/decorators/public.decorator.ts) 当前由 AuthGuard 读取方法元数据并跳过登录检查；RequireAuthGuard 并没有相同的公开跳过逻辑。
- 各守卫当前主要读取 `context.getHandler()` 的元数据，不应假定类级装饰器自动产生同样效果。
- [InnerAuth](../../../../vivy-common/vivy-common-security/src/decorators/inner-auth.decorator.ts) 组合 Public 与内部来源元数据。它不自动构造完整的 `SysLoginUser`；不能假定带来源/用户头的请求可以使用所有 AuthService 或数据范围功能。
- 内部入口的来源头需要实际可信的网关或内网边界。实现内部调用时核验已有边界与用户信息要求，不把客户端自报来源当成已完成认证。
- 业务接口缺少权限时补正确的授权条件；不要通过添加 Public、InnerAuth 或移除守卫来使失败调用通过。

## 身份与错误协议

SecurityContext 的身份信息必须提前由认证链路附到当前请求。范围过滤的用户 ID、部门和角色来自该会话，不从任意查询参数或表单字段覆盖。

复用 `NotLoginException`、`NotPermissionException`、`NotRoleException` 和项目过滤器。[ServiceExceptionFilter](../../../../vivy-common/vivy-common-core/src/exceptions-filters/service.filter.ts) 当前以 HTTP 200 返回业务错误：未登录 `body.code` 为 401，角色/权限不足为 403。测试是否使用这个协议取决于实际是否注册过滤器，不能仅检查 HTTP 状态。

## 改动范围

排查时先确认是哪一环节产生失败，保留现有账户状态、验证码、会话注销与身份注入行为。只有任务要求改变机制时才调整认证流程；不要为单个业务接入引入另一套 JWT/会话体系。
