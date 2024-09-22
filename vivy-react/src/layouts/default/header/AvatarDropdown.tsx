import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { SettingDrawer } from '@ant-design/pro-components'
import { history, useModel } from '@umijs/max'
import { Dropdown } from 'antd'
import React, { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import { logout } from '@/apis/auth/login'
import { PageEnum } from '@/enums/pageEnum'
import { removeToken } from '@/utils/auth'
import { setThemeSetting } from '@/utils/setting'

const AvatarDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const [settingOpen, setSettingOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    removeToken()
    history.push(PageEnum.BASE_LOGIN)
  }

  const onMenuClick = useCallback(
    async (event: any) => {
      const { key } = event
      if (key === 'center') {
        history.push(`/account/${key}`)
      } else if (key === 'setting') {
        setSettingOpen(true)
      } else if (key === 'logout') {
        await handleLogout()
        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            token: undefined,
            roles: undefined,
            permissions: undefined,
            userInfo: undefined,
          }))
        })
      }
    },
    [setInitialState]
  )

  return (
    <>
      <Dropdown
        menu={{
          onClick: onMenuClick,
          items: [
            {
              key: 'center',
              icon: <UserOutlined />,
              label: '个人中心',
            },
            {
              key: 'setting',
              icon: <SettingOutlined />,
              label: '主题设置',
            },
            {
              key: 'divider',
              type: 'divider',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
            },
          ],
        }}
      >
        {children}
      </Dropdown>
      <SettingDrawer
        collapse={settingOpen}
        disableUrlParams
        enableDarkTheme
        hideHintAlert
        hideCopyButton
        settings={initialState?.settings}
        onCollapseChange={setSettingOpen}
        onSettingChange={(settings) => {
          setThemeSetting(settings)
          setInitialState((preInitialState) => ({
            ...preInitialState,
            settings,
            isDarkMode: settings?.navTheme === 'realDark',
          }))
        }}
      />
    </>
  )
}

export default AvatarDropdown
