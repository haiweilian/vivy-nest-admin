import { defineConfig } from 'vitepress'
const taskLists = require('markdown-it-task-lists')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vivy-nest-admin/',
  title: 'Vivy Nest Admin',
  description: '基于 Nest.js & React.js 的后台权限管理系统',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Gitee', link: 'https://gitee.com/haiweilian/vivy-nest-admin' },
      { text: 'Github', link: 'https://github.com/haiweilian/vivy-nest-admin' },
    ],
    sidebar: [
      {
        text: '介绍',
        link: '/introduce',
      },
      {
        text: '后端',
        items: [
          { text: '介绍', link: '/back/introduce' },
          {
            text: '插件',
            items: [
              {
                text: 'Config',
                link: '/back/plugin/config',
              },
              {
                text: 'Mybatis',
                link: '/back/plugin/mybatis',
              },
            ],
          },
        ],
      },
      {
        text: '前端',
        items: [{ text: '介绍', link: '/front/introduce' }],
      },
    ],
  },
  markdown: {
    config(md) {
      md.use(taskLists)
    },
  },
})
