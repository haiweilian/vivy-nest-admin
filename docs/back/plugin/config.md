# Config

用于获取本地配置和环境值。

::: tip
目前为本地插件，稳定后考虑单独发布包。
:::

## 安装

```bash
pnpm install --save @vivy-common/config
```

## 开始

[示例应用](https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system)

### 导入模块

```ts
// app.module.ts
import * as path from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@vivy-common/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      cwd: path.join(__dirname, 'config'),
    }),
  ],
})
export class AppModule {}
```

```json{7}
// nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": ["**/*.yaml"],
    "watchAssets": true
  }
}
```

### 配置文件

以上配置将从 `config` 目录按顺序加载并解析下列文件。

```bash
config.yaml                # 所有情况下都会加载
config.local.yaml          # 所有情况下都会加载，应被 git 忽略
config.[env].yaml          # 只在指定环境下加载
config.[env].local.yaml    # 只在指定环境下加载，应被 git 忽略
```

```yaml
server:
  port: 3010
  name: config
```

- 环境变量从 `process.env.NODE_ENV` 设置，没有设置默认为 `development` 。

- 配置文件 `**.local.yaml` 被设计为本地个性化配置，你应该将 `**.local.yaml` 添加到你的 `.gitignore` 中，以避免它们被 `git` 检入。

## 使用

### 注入实例

```ts
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@vivy-common/config'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.config.get()
    this.config.get<number>('service.port')
    this.config.get<number>('service.port', 3000)
  }
}
```

## 模板编译

通过 [handlebars.js](https://github.com/handlebars-lang/handlebars.js) 编译。

模板：

```bash
# 自动添加 process.env 对象到编译上下文中
process.env.SERVICE_ID = 'your-service-id'
process.env.SERVICE_NAME = 'your-service-name'
```

```yaml
service:
  id: ${{ SERVICE_ID }}
  name: ${{ SERVICE_NAME }}
  port: 3000
  address: http://${{ service.name }}:${{ service.port }}
```

结果：

```yaml
service:
  id: your-service-id
  name: your-service-name
  port: 3000
  address: http://your-service-name:3000
```

## API

[Config API](https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-common/vivy-plugin-config/src/config.service.ts)
