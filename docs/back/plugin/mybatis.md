# Mybatis

用于增强手写 SQL 灵活性，基于 [mybatis-mapper](https://github.com/OldBlackJoe/mybatis-mapper) 封装。

::: tip
目前为本地插件，稳定后考虑单独发布包。
:::

## 安装

```bash
pnpm install --save @vivy-common/mybatis
```

## 开始

[示例应用](https://github.com/haiweilian/vivy-nest-admin/tree/main/vivy-modules/vivy-system)

### 导入模块

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { MybatisModule } from '@vivy-common/mybatis'

@Module({
  imports: [
    MybatisModule.forRoot({
      cwd: __dirname,
      globs: ['**/*.mapper.xml'],
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
    "assets": ["**/*.mapper.xml"],
    "watchAssets": true
  }
}
```

## 使用

以上导入的配置将会加载所有的 `*.mapper.xml` 文件，使用 `namespace` 和 `id` 属性区分语句。更多语法参考 [mybatis-mapper](https://github.com/OldBlackJoe/mybatis-mapper) 文档。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="fruit">
  <select id="basic">
    SELECT
      name,
      category,
      price
    FROM
      fruits
    WHERE
      category = #{category}
  </select>
</mapper>
```

我们可以创建一个 `mapper` 层，用于处理SQL语句和结果便于在 `service` 层使用。

```ts
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { MybatisService } from '@vivy-common/mybatis'
import { EntityManager } from 'typeorm'

@Injectable()
export class GenMapper {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private mybatisService: MybatisService
  ) {}

  async basic(category: string): Promise<any[]> {
    const sql = this.mybatisService.getSql('fruit', 'basic', {
      category,
    })
    const result = this.entityManager.query(sql)
    return result
  }
}
```

## API

[Config API](https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-common/vivy-plugin-mybatis/src/mybatis.service.ts)
