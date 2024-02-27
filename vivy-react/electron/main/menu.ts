import { Menu, shell } from 'electron'

export function createMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Vivy React',
      submenu: [
        {
          role: 'quit',
          label: '退出',
        },
      ],
    },
    {
      label: '帮助中心',
      submenu: [
        {
          label: '源代码',
          click() {
            shell.openExternal('https://github.com/haiweilian/vivy-nest-admin')
          },
        },
        {
          label: '开发文档',
          click() {
            shell.openExternal('https://haiweilian.github.io/vivy-nest-admin/introduce.html')
          },
        },
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}
