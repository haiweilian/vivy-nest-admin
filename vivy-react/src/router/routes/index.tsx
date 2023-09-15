import { AppRouteMenu } from '../types'

export const localRoutes: AppRouteMenu[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: 'home/index',
    icon: 'HomeOutlined',
  },
  {
    name: '登录',
    path: '/login',
    component: 'login/index',
    layout: false,
    hideInMenu: true,
  },
  {
    name: '账号管理',
    path: '/account',
    hideInMenu: true,
    children: [
      {
        name: '个人中心',
        path: 'center',
        component: 'account/center/index',
      },
    ],
  },
  {
    path: '*',
    component: '404',
    layout: false,
    hideInMenu: true,
  },
]
