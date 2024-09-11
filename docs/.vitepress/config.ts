import { defineConfig } from 'vitepress'
import taskLists from 'markdown-it-task-lists'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vivy-nest-admin/',
  title: 'Vivy Nest Admin',
  description: '基于 Nest.js & React.js 的后台权限管理系统',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/logo.png',
    outline: 'deep',
    nav: [
      { text: '首页', link: '/' },
      { text: '在线演示', link: 'http://43.140.221.180:8000' },
      { text: 'Gitee', link: 'https://gitee.com/haiweilian/vivy-nest-admin' },
      { text: 'Github', link: 'https://github.com/haiweilian/vivy-nest-admin' },
    ],
    sidebar: [
      {
        text: '介绍',
        link: '/introduce',
      },
      {
        text: '本地开发',
        link: '/development',
      },
      {
        text: '环境部署🚧',
        link: '/deployment',
      },
      {
        text: '贡献指南🚧',
        link: '/contribution',
      },
      {
        text: '更新日志',
        link: '/changelog',
      },
      {
        text: '后端手册',
        items: [
          {
            text: '介绍',
            link: '/back/introduce',
          },
          {
            text: '通用模块',
            items: [
              {
                text: '系统接口',
                link: '/back/common/swagger',
              },
              {
                text: '系统日志',
                link: '/back/common/logger',
              },
              {
                text: '导入导出',
                link: '/back/common/excel',
              },
              {
                text: '异常处理',
                link: '/back/common/exception',
              },
              {
                text: '参数校验',
                link: '/back/common/validator',
              },
              {
                text: '系统权限',
                link: '/back/common/security',
              },
              {
                text: '数据权限',
                link: '/back/common/datascope',
              },
              {
                text: '数据脱敏',
                link: '/back/common/sensitive',
              },
              {
                text: '异步上下文',
                link: '/back/common/context',
              },
              {
                text: '装饰器(注解)',
                link: '/back/common/decorator',
              },
            ],
          },
          {
            text: '业务模块',
            items: [
              {
                text: '代码生成',
                link: '/back/business/gen',
              },
              {
                text: '文件上传',
                link: '/back/business/upload',
              },
              {
                text: '定时任务',
                link: '/back/business/job',
              },
              {
                text: '新建子模块',
                link: '/back/business/template',
              },
            ],
          },
          {
            text: '本地插件',
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
        text: '前端手册',
        items: [
          {
            text: '介绍',
            link: '/front/introduce',
          },
          {
            text: '动态菜单',
            link: '/front/dynamic-menu',
          },
          {
            text: '项目组件',
            items: [
              {
                text: '数据字典',
                link: '/front/components/dict',
              },
            ],
          },
          {
            text: '桌面应用程序',
            link: '/front/electron',
          },
        ],
      },
    ],
  },
  markdown: {
    config(md) {
      md.use(taskLists)
    },
  },
})
