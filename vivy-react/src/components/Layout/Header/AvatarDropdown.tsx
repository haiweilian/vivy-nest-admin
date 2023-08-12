import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { history, useModel } from '@umijs/max'
import { Dropdown } from 'antd'
import type { MenuInfo } from 'rc-menu/lib/interface'
import React, { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { logout } from '@/apis/auth/login'
import { PageEnum } from '@/enums/pageEnum'
import { removeToken } from '@/utils/auth'

const AvatarDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setInitialState } = useModel('@@initialState')

  const handleLogout = async () => {
    await logout()
    history.replace(PageEnum.BASE_LOGIN)
    removeToken()
  }

  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const { key } = event
      if (key === 'logout') {
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
      } else if (key === 'center') {
        history.push(`/account/${key}`)
      }
    },
    [setInitialState]
  )

  return (
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
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}

export default AvatarDropdown
