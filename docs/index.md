---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: Vivy Nest Admin
  text: 后台权限管理系统
  tagline: 基于 Nest.js & React.js 的后台权限管理系统
  image:
    src: /logo-home.png
    alt: Vivy Nest Admin
  actions:
    - theme: brand
      text: 快速开始
      link: /introduce
    - theme: alt
      text: 在线演示
      link: http://43.140.221.180:8000
    - theme: alt
      text: 查看源码
      link: https://github.com/haiweilian/vivy-nest-admin

features:
  - icon: 🚀
    title: 最新技术栈
    details: 使用最新版本技术栈。
    link: /introduce
    linkText: 快速开始
  - icon: 🔐
    title: 权限管理
    details: 内置系统权限、数据权限功能。
    link: /back/common/security
    linkText: 模块文档
  - icon:
      src: /logos/gen.png
    title: 代码生成
    details: 通过表结构生成前后端代码。
    link: /back/business/gen
    linkText: 模块文档
  - icon:
      src: /logos/plugin.png
    title: 本地插件
    details: 本地实现多个插件，配置管理、表格导出、Mybatis 等插件助力开发。
    link: /back/plugin/config
    linkText: 模块文档
  - icon:
      src: /logos/nest.png
    title: Nest
    details: 一个渐进的Node.js框架，用于构建高效、可靠和可扩展的服务器端应用程序。
    link: https://docs.nestjs.com
    linkText: 官方站点
  - icon:
      src: /logos/umi.png
    title: Umi Max
    details: Umi 集成企业级插件，通过 @umijs/max 提供高效的前端开发体验。
    link: https://umijs.org/docs/max/introduce
    linkText: 官方站点
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

.VPHomeFeatures .VPFeature .VPImage {
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
}
</style>
