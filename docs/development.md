# 本地开发

## 下载项目

克隆项目到本地

```sh
git clone https://github.com/haiweilian/vivy-nest-admin.git
```

此项目使用 `pnpm` 的 `workspace` 管理项目，所以必须使用 `pnpm` 安装依赖。

```sh
pnpm install
```

## 环境准备

如果 **没有** `mysql` 和 `redis` 环境，可以下载 [docker](https://www.docker.com) 使用此项目的环境配置。

```sh
# 启动 mysql 和 redis 的服务
pnpm run docker:base
```

如果是用 `docker` 启动的环境那么将会自动初始化数据库表和数据。

如果不是或初始化有问题你可以手动执行 [sql/vivy-nest-admin.sql](https://github.com/haiweilian/vivy-nest-admin/blob/main/sql/vivy-nest-admin.sql) 用于数据库初始化。

## 运行项目

构建通用模块。

```sh
pnpm run build:common
```

启动后端开发服务，通过 http://localhost:9200 访问。

```sh
cd vivy-modules/vivy-system
pnpm run dev
```

启动前端开发服务，通过 http://localhost:8000 访问。

```sh
cd vivy-react
pnpm run dev
```
