import { GithubOutlined } from '@ant-design/icons'
import { SettingDrawer } from '@ant-design/pro-components'
import type { Settings as LayoutSettings } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import type { RunTimeLayoutConfig, RequestConfig } from '@umijs/max'
import { message as Message, Modal } from 'antd'
import { getLoginUserInfo } from '@/apis/auth/auth'
import { AvatarName, AvatarDropdown } from '@/components/Layout'
import { PageEnum } from '@/enums/pageEnum'
import { getToken, removeToken } from '@/utils/auth'
import defaultSettings from '../config/setting'

/**
 * @name InitialState 全局初始化数据配置用于 Layout 用户信息和权限初始化
 * @doc https://umijs.org/docs/api/runtime-config#getinitialstate
 */
interface InitialState {
  settings?: Partial<LayoutSettings>
  token?: string
  roles?: string[]
  permissions?: string[]
  userInfo?: UserInfo
  fetchUserInfo?: () => Promise<
    | {
        roles?: string[]
        permissions?: string[]
        userInfo?: UserInfo
      }
    | undefined
  >
}
export async function getInitialState(): Promise<InitialState> {
  const token = getToken()
  const location = history.location
  const fetchUserInfo = async () => {
    try {
      const { roles, permissions, sysUser } = await getLoginUserInfo()
      return {
        roles,
        permissions,
        userInfo: sysUser,
      }
    } catch (error) {
      removeToken()
      history.push(PageEnum.BASE_LOGIN)
      throw error
    }
  }
  if (token && location.pathname !== PageEnum.BASE_LOGIN) {
    const userInfo = await fetchUserInfo()
    return {
      fetchUserInfo,
      ...userInfo,
      settings: defaultSettings as Partial<LayoutSettings>,
    }
  } else {
    removeToken()
    if (location.pathname !== PageEnum.BASE_LOGIN) {
      history.push(PageEnum.BASE_LOGIN)
    }
  }

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  }
}

/**
 * @name ProLayout 运行时布局配置
 * @doc https://procomponents.ant.design/components/layout#prolayout
 */
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const user = initialState?.userInfo as UserInfo

  return {
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
      title: <AvatarName name={user.nickName} />,
      render: (_, children) => {
        return <AvatarDropdown>{children}</AvatarDropdown>
      },
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    actionsRender: () => {
      return [
        <GithubOutlined
          key="github"
          onClick={() => {
            window.open('https://github.com/haiweilian/vivy-nest-admin')
          }}
        />,
      ]
    },
    // footerRender: () => {
    //   return <Footer />;
    // },
    childrenRender: (children) => {
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }))
            }}
          />
        </>
      )
    },
    // onPageChange: (location) => {
    //   console.log('onPageChange', location);
    // },
    ...initialState?.settings,
  }
}

/**
 * @name Request 运行时请求配置
 * @doc https://umijs.org/docs/max/request
 */
const status = { isOpen: true }
export const request: RequestConfig = {
  timeout: 1000 * 60,
  requestInterceptors: [
    [
      (config: any) => {
        const token = getToken()
        const isToken = config.isToken === false
        if (token && !isToken) {
          config.headers.Authorization = 'Bearer ' + token
        }
        config.url = `${BASE_URL}${config.url}`
        return config
      },
      (error: any) => {
        return Promise.reject(error)
      },
    ],
  ],
  responseInterceptors: [
    [
      (response: any) => {
        const code = response.data.code || 200
        const message = response.data.message || '系统未知错误，请反馈给管理员'
        const skipErrorHandler = response.config.skipErrorHandler

        // 错误判断
        if (skipErrorHandler) {
          if (code !== 200) {
            return Promise.reject(message)
          }
        } else if (code === 401) {
          if (status.isOpen) {
            status.isOpen = false
            Modal.confirm({
              title: '系统提示',
              content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
              cancelText: '取消',
              okText: '重新登录',
              onOk() {
                status.isOpen = true
                history.push(PageEnum.BASE_LOGIN)
              },
              onCancel() {
                status.isOpen = true
              },
            })
          }
          return Promise.reject(message)
        } else if (code !== 200) {
          Message.error(message)
          return Promise.reject(message)
        }

        return response.data
      },
      (error: any) => {
        const skipErrorHandler = error.config.skipErrorHandler
        if (skipErrorHandler) {
          return Promise.reject(error)
        }

        let { message } = error

        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }

        Message.error(message)
        return Promise.reject(error)
      },
    ],
  ],
}
