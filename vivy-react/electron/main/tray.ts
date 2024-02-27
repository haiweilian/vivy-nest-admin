import os from 'os'
import path from 'path'
import { platform } from '@electron-toolkit/utils'
import { Menu, Tray, app, shell, dialog } from 'electron'
import { version } from '../../package.json'

export function createTray() {
  let icon
  if (platform.isMacOS) {
    icon = 'iconTemplate@2x.png'
  } else if (platform.isWindows) {
    icon = parseInt(os.release()) < 10 ? 'icon@2x.png' : 'icon.ico'
  } else {
    icon = 'icon@2x.png'
  }

  const menu = Menu.buildFromTemplate([
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
    { type: 'separator' },
    {
      label: '重启',
      click() {
        app.relaunch()
        app.quit()
      },
    },
    {
      role: 'quit',
      label: '退出',
    },
    { type: 'separator' },
    {
      label: '关于',
      click() {
        dialog.showMessageBox({
          title: 'Vivy',
          message: '基于 Nest.js & React.js 的后台权限管理系统',
          detail: `Version: ${version}\nAuthor: haiweilian`,
        })
      },
    },
  ])

  const tray = new Tray(path.join(__dirname, '../resources/icons/', icon))
  tray.setContextMenu(menu)
  tray.on('click', () => {
    console.log('tray click ...')
  })
}
