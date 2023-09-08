# 新建子模块

当系统特别复杂的时候，如果需要可以业务线拆分出独立的服务模块。

1. 复制 `vivy-modules/vivy-template` 的基础模板，列如重命名 `vivy-test`。

2. 更改 `vivy-modules/vivy-test/src/config/*.yaml` 中的项目配置信息。

```yaml
app:
  port: 9400
  name: vivy-test
```
