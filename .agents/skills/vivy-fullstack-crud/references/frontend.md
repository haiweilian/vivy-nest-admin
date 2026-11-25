# 前端实现

在修改 API 类型、列表、表单或字段控件时读取本文件。前端单层任务以已有接口为基础，不自动创建数据库和后端模块。

## 实际范例

| 需要的能力                     | 当前源码                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 列表、搜索、批量操作、权限按钮 | [岗位列表](../../../../vivy-react/src/pages/system/post/index.tsx)                                                                           |
| 新增/编辑抽屉、详情初始化      | [岗位 UpdateForm](../../../../vivy-react/src/pages/system/post/components/UpdateForm.tsx)                                                    |
| API 与请求类型                 | [岗位 API](../../../../vivy-react/src/apis/system/post/index.ts)、[model.ts](../../../../vivy-react/src/apis/system/post/model.ts)           |
| 部门树与关联选择               | [部门页面](../../../../vivy-react/src/pages/system/dept)、[用户表单](../../../../vivy-react/src/pages/system/user/components/UpdateForm.tsx) |
| 内容编辑                       | [通知公告表单](../../../../vivy-react/src/pages/system/notice/components/UpdateForm.tsx)                                                     |
| 公共字典与请求类型             | [字典模型](../../../../vivy-react/src/models/dict.ts)、[请求声明](../../../../vivy-react/types/request.d.ts)                                 |

## API 与返回值

- 按现有目录组织 `src/apis/<领域>/<业务>/index.ts` 与 `model.ts`；区分读取模型、查询参数、创建参数和更新参数。
- 调用 Umi Max 的 `request`，HTTP 方法使用 `RequestEnum`。沿用 [app.tsx](../../../../vivy-react/src/app.tsx) 的认证、响应和错误处理。
- 普通 API 调用按现有范例接收业务数据；检查特殊的 `getResponse`、`getAjaxResponse` 选项和 [config.ts](../../../../vivy-react/config/config.ts) 的 `dataField`。不要在页面重复套用另一种响应解包协议。
- 查询使用 `params`，写入使用 `data`；ID 位于路径还是请求体以实际 Controller 为准。
- 保持状态值、日期、空值、关联 ID 和数组类型与 DTO 一致；不以 `any` 或将权限类型改成任意 string 来绕过不一致。

## 列表

按用户需要选择列表列、搜索项和操作，不把所有数据库列自动变成搜索框或可编辑字段。普通管理列表复用 ProTable，特殊布局参考最接近的现有页面。

分页转换沿用岗位页面：

```tsx
<ProTable
  request={async (params) => {
    const { items, meta } = await listResource({
      ...params,
      page: params.current,
      limit: params.pageSize,
    })
    return { data: items, total: meta.totalItems }
  }}
/>
```

`listResource` 是当前业务 API 的示意名称，需替换成实际函数。

- 设置稳定的 `rowKey`。批量操作按后端约定序列化 ID，完成后清理选择并刷新列表。
- 字典项复用 `useModel('dict')` 的 `loadDict`、`toSelect` 和 `DictTag`；已有字典优先复用，新字典按需求提供配置。
- 日期范围、关联筛选、排序等请求字段明确转换为 DTO 接收的格式，不直接透传组件专用结构。
- 删除确认、提交状态和错误反馈沿用现有组件。失败时保持可修正的界面状态，成功后执行刷新与必要的清理。

## 表单

- 新增和编辑可共享现有 DrawerForm / UpdateForm 模式；页面要求其他交互时按现有组件组合实现。
- 打开新增表单时清理上次记录；编辑时按接口约定读取详情并填充。初始化请求与当前记录保持一致，避免旧响应覆盖新选择。
- 只提交 DTO 允许修改的业务字段。主键、创建时间和服务端审计字段用于展示或定位，不混入可写 payload。
- 控件按字段语义选型：文本、数字、日期、字典、关联选择、富文本或文件。关联选项需要相应的现有 API，缺少时按任务范围处理接口需求。
- 默认值、必填、长度、精度、条件必填与禁用状态依据业务；前端校验与后端校验一致。
- `onFinish` 等成功回调在写入成功后返回成功并触发刷新；请求失败不能被当成成功关窗。

## 权限与页面接入

按钮复用 `Access` / `useAccess`，对应权限码需同时存在于后端和菜单配置。编辑抽屉可能额外调用详情 API，因此核验 `update` 与 `query` 的实际请求组合。

新页面需同步 [AccessPermission](../../../../vivy-react/types/access.d.ts) 中的实际字面量声明，以及菜单组件路径与动态路由映射；不能只创建页面就声称完整业务已接入。具体规则见 [integration.md](integration.md)。
