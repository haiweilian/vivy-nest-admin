# 桌面应用程序

在项目中可能会有构建桌面应用程序的需求，在不改变现有前端项目结构的情况下使用 [electron-vite](https://github.com/alex8088/electron-vite) 构建桌面应用程序。代码在 [electron](https://github.com/haiweilian/vivy-nest-admin/tree/electron) 单独分支。

## 新增代码

新增 electron 文件夹以及相关的代码。

```
// vivy-react/electron
├── electron
│   ├── build
│   ├── main // 主进程
│   ├── preload // 预加载脚本
│   └── resources // 静态资源
├── electron-builder.yml // electron-builder 配置
├── electron.vite.config.ts // electron-vite 配置
```

现有的前端项目做为渲染进程的内容做兼容处理。

```ts
// vivy-react/config/config.ts
export default {
  /**
   * @name Electron集成兼容配置
   */
  history: { type: 'hash' },
  outputPath: 'dist/renderer',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
}
```

## 开发构建

在开发环境需要启动 `umi` 服务和 `electron` 服务。

```sh
pnpm run dev // umi
pnpm run electron:dev // electron
```

在开发环境中 `electron` 通过 `loadURL` 加载内容做到渲染进程热更新。构建环境中加载构建后的本地渲染进程文件。

```js
// vivy-react/electron/main/index.ts
if (is.dev) {
  mainWindow.loadURL('http://localhost:8000')
} else {
  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}
```

构建应用程序在对应的平台执行命令。

```json
{
  "electron:build:win": "max build && electron-vite build && electron-builder --win --config",
  "electron:build:mac": "max build && electron-vite build && electron-builder --mac --config",
  "electron:build:linux": "max build && electron-vite build && electron-builder --linux --config"
}
```

## 相关源码

- https://github.com/haiweilian/vivy-nest-admin/tree/electron

- https://github.com/haiweilian/vivy-nest-admin/tree/electron/vivy-react/electron
