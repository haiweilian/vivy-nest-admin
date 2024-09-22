import { GithubOutlined, ReadFilled } from '@ant-design/icons'
import type { Settings as LayoutSettings, ProLayoutProps } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import type { RuntimeConfig, RunTimeLayoutConfig, RequestConfig } from '@umijs/max'
import { Tooltip } from 'antd'
import { getUserInfo, getUserRouters } from '@/apis/auth/login'
import { App, Modal, Message } from '@/components/App'
import { PageEnum } from '@/enums/pageEnum'
import { AvatarName, AvatarDropdown } from '@/layouts/default'
import { getToken, removeToken } from '@/utils/auth'
import { getThemeSetting } from '@/utils/setting'
import { buildMenus } from './router/helper/menu'
import { buildRoutes } from './router/helper/route'

/**
 * @name InitialState 全局初始化数据配置用于 Layout 用户信息和权限初始化
 * @doc https://umijs.org/docs/api/runtime-config#getinitialstate
 */
interface InitialState {
  settings?: Partial<LayoutSettings & { token: ProLayoutProps['token'] }>
  token?: string
  roles?: string[]
  permissions?: string[]
  userInfo?: UserInfo
  isDarkMode?: boolean
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
  const defaultSettings = getThemeSetting()
  const fetchUserInfo = async () => {
    try {
      const { roles, permissions, sysUser } = await getUserInfo()
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
      isDarkMode: defaultSettings?.navTheme === 'realDark',
    }
  } else {
    if (location.pathname !== PageEnum.BASE_LOGIN) {
      removeToken()
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
  const user = initialState?.userInfo

  return {
    avatarProps: {
      src: user?.avatar,
      title: <AvatarName name={user?.nickName || ''} />,
      render: (_, children) => {
        return <AvatarDropdown>{children}</AvatarDropdown>
      },
    },
    bgLayoutImgList: [
      {
        src: '/bg/1.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: '/bg/2.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: '/bg/3.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    postMenuData(menuData) {
      return buildMenus(menuData!)
    },
    actionsRender: () => {
      return [
        <Tooltip key="docs" title="项目文档">
          <ReadFilled
            onClick={() => {
              window.open('https://haiweilian.github.io/vivy-nest-admin')
            }}
          />
        </Tooltip>,
        <Tooltip key="github" title="项目源码">
          <GithubOutlined
            onClick={() => {
              window.open('https://github.com/haiweilian/vivy-nest-admin')
            }}
          />
        </Tooltip>,
      ]
    },
    childrenRender: (children) => {
      return <App>{children}</App>
    },
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
        const getResponse = response.config.getResponse
        const skipErrorHandler = response.config.skipErrorHandler

        // 错误判断
        if (skipErrorHandler) {
          if (code !== 200) {
            return Promise.reject(new Error(message))
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
                removeToken()
                history.push(PageEnum.BASE_LOGIN)
              },
              onCancel() {
                status.isOpen = true
              },
            })
          }
          return Promise.reject(new Error(message))
        } else if (code !== 200) {
          Message.error(message)
          return Promise.reject(new Error(message))
        }

        return getResponse ? response : response.data
      },
      (error: any) => {
        const skipErrorHandler = error.config.skipErrorHandler
        if (skipErrorHandler) {
          return Promise.reject(error)
        }

        Message.error('系统未知错误，请反馈给管理员')
        return Promise.reject(error)
      },
    ],
  ],
}

let dynamicRoutes: any[] = []
/**
 * @name patchClientRoutes 修改路由表
 * @doc https://umijs.org/docs/api/runtime-config#patchclientroutes-routes-
 */
export const patchClientRoutes: RuntimeConfig['patchClientRoutes'] = async ({ routes }) => {
  buildRoutes(routes, dynamicRoutes)
}

/**
 * @name render 覆写渲染函数
 * @doc https://umijs.org/docs/api/runtime-config#renderoldrender-function
 */
export const render: RuntimeConfig['render'] = (oldRender) => {
  const token = getToken()
  if (token) {
    getUserRouters()
      .then((data) => {
        dynamicRoutes = data
      })
      .catch(() => {
        removeToken()
        history.push(PageEnum.BASE_LOGIN)
      })
      .finally(() => {
        oldRender()
      })
  } else {
    dynamicRoutes = []
    oldRender()
  }
}
