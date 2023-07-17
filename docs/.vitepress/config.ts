import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs/',
  title: 'vivy-nest-admin',
  description: '基于 Nest.js & React.js 的后台权限管理系统',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '后端', link: '/back/introduce' },
      { text: '前端', link: '/front/introduce' },
    ],
    sidebar: [
      {
        text: '介绍',
        link: '/introduce',
      },
      {
        text: '后端',
        items: [{ text: '介绍', link: '/back/introduce' }],
      },
      {
        text: '前端',
        items: [{ text: '介绍', link: '/front/introduce' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/haiweilian/vivy-nest-admin' }],
  },
})
