# 动态菜单

动态菜单是通过接口动态生成路由表，且遵循一定的数据结构返回。前端根据需要处理该数据为可识别的结构，再通过 `patchClientRoutes` 添加到路由表，再根据路由表生成动态菜单。

## 新增菜单

新增菜单需要在 _系统管理/菜单管理_ 下添加。

列如添加了一个 _测试菜单_ 的配置其返回结果如下，那么就可以通过 `/system/test` 访问。

```ts
;[
  {
    name: '系统管理',
    path: '/system',
    children: [
      {
        name: '测试菜单',
        path: 'test',
        component: 'system/test/index',
      },
    ],
  },
]
```

那么现在也只是能访问但无页面内容，还需要按照 `component` 属性指定的路径在 `src/pages` 建立相同路径(`system/test/index.tsx`)的页面。

```sh
├── src
│   ├── pages
│   │   ├── system
│   │   │   ├── test
│   │   │   │   └── index.tsx
```

## 本地菜单

有时我们的菜单并不总是从后台返回，列如 _登录_ 和 _首页_ 的路由。这时可以在本地创建路由表与动态路由表合并。

```ts
// vivy-react/src/router/routes/index.tsx
export const localRoutes: AppRouteMenu[] = [
  {
    name: '首页',
    path: '/home',
    component: 'home/index',
    icon: 'HomeOutlined',
  },
  {
    name: '登录',
    path: '/login',
    component: 'login/index',
    layout: false,
    hideInMenu: true,
  },
]
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-react/src/router

- https://github.com/haiweilian/vivy-nest-admin/blob/main/vivy-react/src/app.tsx
