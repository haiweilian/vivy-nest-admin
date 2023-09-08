# 数据字典

数据字典在系统设计中是很常用的方案。由于需要从后台拉取并且多个地方使用，所以要做一些缓存和转化。

## 数据存储

使用 `Umi Max` 的[数据流](https://umijs.org/docs/max/data-flow)管理插件实现。

```tsx
// vivy-react/src/models/dict.ts
export default () => {
  const [dict, actions] = useMap<DictType, DictData[]>()

  /**
   * 加载字典列表
   * @param type 字典类型
   */
  const loadDict = (type: DictType) => {
    // ...
  }

  /**
   * 重新加载字典
   * @param type 字典类型
   */
  const reloadDict = (type: DictType) => {
    // ...
  }

  /**
   * 转化为下拉选项
   */
  const toSelect = (data: DictData[]) => {
    // ...
  }

  /**
   * 转化为枚举选项
   */
  const toMapEnum = (data: DictData[]) => {
    // ...
  }

  return {
    dict,
    loadDict: useCallback(loadDict, [dict]),
    reloadDict: useCallback(reloadDict, []),
    toSelect: useCallback(toSelect, []),
    toMapEnum: useCallback(toMapEnum, []),
  }
}
```

## 基础使用

列如在表格中使用：

1. 使用 `useModel` 获取到字典数据。
2. 使用 `loadDict` 加载数据，如果不存在调用接口存在直接返回(包含禁用、已删除)。
3. 使用 `toSelect` 获取到可选择的，而列表使用全部的用做展示。

```tsx{9,10,20,22}
import { ProTable } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { DictTag } from '@/components/Dict'

const Dict = () => {
  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 表格列配置
   */
  const columns: ProColumns<any>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNormalDisable) },
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />
      },
    },
  ]

  return <ProTable columns={columns} />
}

export default Dict
```
