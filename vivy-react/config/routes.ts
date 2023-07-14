/**
 * @name umi 的路由配置
 * @doc https://umijs.org/docs/guides/routes
 */
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './home',
    icon: 'HomeOutlined',
  },
  {
    name: '登录',
    path: '/login',
    component: './login',
    layout: false,
    hideInMenu: true,
  },
  {
    name: '账号管理',
    path: '/account',
    hideInMenu: true,
    routes: [
      {
        name: '个人中心',
        path: 'center',
        component: './account/center',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/system',
    icon: 'SettingOutlined',
    routes: [
      {
        name: '用户管理',
        path: 'user',
        component: './system/user',
      },
      {
        name: '角色管理',
        path: 'role',
        component: './system/role',
      },
      {
        name: '菜单管理',
        path: 'menu',
        component: './system/menu',
      },
      {
        name: '部门管理',
        path: 'dept',
        component: './system/dept',
      },
      {
        name: '岗位管理',
        path: 'post',
        component: './system/post',
      },
      {
        name: '字典管理',
        path: 'dict',
        component: './system/dict',
      },
      {
        name: '字典数据',
        path: 'dict/:type',
        component: './system/dict/$type',
        hideInMenu: true,
      },
      {
        name: '日志管理',
        path: 'log',
        routes: [
          {
            name: '登录日志',
            path: 'login',
            component: './system/log/login',
          },
          {
            name: '操作日志',
            path: 'operation',
            component: './system/log/operation',
          },
        ],
      },
    ],
  },
  {
    path: '*',
    component: './404',
    layout: false,
    hideInMenu: true,
  },
];

export default routes;
