# vivy-ai

AI 业务独立服务，默认端口 `9201`，业务数据存储在 PostgreSQL。

## 边界

- 用户、角色、菜单和权限码仍由 `vivy-system` 的 MySQL 管理，本服务只消费登录态，不建这些表。
- 必须与 `vivy-system` 的 `security.jwt.secret` 一致，并共用同一 Redis 实例的 db 0，否则登录态无法互认。
- 表结构初始化见 [sql/postgres/vivy-ai.sql](../../sql/postgres/vivy-ai.sql)；开发配置开启 `synchronize` 可自动建表，生产配置关闭。

## 命令

| 任务 | 命令                          |
| ---- | ----------------------------- |
| 开发 | `pnpm --filter vivy-ai dev`   |
| 构建 | `pnpm --filter vivy-ai build` |
