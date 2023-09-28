import { resolve } from 'path'
import { defineConfig } from '@umijs/max'
import icons from './icons'
import proxy from './proxy'
// import routes from './routes'
import defaultSettings from './setting'

export default defineConfig({
  npmClient: 'pnpm',
  /**
   * @name 开发插件
   * @doc https://umijs.org/docs/guides/plugins
   */
  plugins: [resolve(__dirname, './plugins/html')],
  /**
   * @name 开启 hash 模式
   * @description 让 build 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。
   * @doc https://umijs.org/docs/api/config#hash
   */
  hash: true,
  /**
   * @name 路由的配置，不在路由中引入的文件不会编译
   * @description 只支持 path，component，routes，redirect，wrappers，title 的配置
   * @doc https://umijs.org/docs/guides/routes
   */
  // routes,
  /**
   * @name 代理配置
   * @description 可以让你的本地服务器代理到你的服务器上，这样你就可以访问服务器的数据了
   * @see 要注意以下 代理只能在本地开发时使用，build 之后就无法使用了。
   * @doc 代理介绍 https://umijs.org/docs/guides/proxy
   * @doc 代理配置 https://umijs.org/docs/api/config#proxy
   */
  proxy,
  /**
   * @name antd 插件
   * @description 内置了 babel import 插件
   * @doc https://umijs.org/docs/max/antd#antd
   */
  antd: {
    appConfig: {},
    configProvider: {},
  },
  /**
   * @name 权限插件
   * @description 基于 initialState 的权限插件，必须先打开 initialState
   * @doc https://umijs.org/docs/max/access
   */
  access: {},
  /**
   * @name 数据流插件
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 一个全局的初始数据流，可以用它在插件之间共享数据
   * @description 可以用来存放一些全局的数据，比如用户信息，或者一些全局的状态，全局初始状态在整个 Umi 项目的最开始创建。
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name 网络请求配置
   * @description 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
   * @doc https://umijs.org/docs/max/request
   */
  request: {
    dataField: '',
  },
  /**
   * @name layout 插件
   * @doc https://umijs.org/docs/max/layout-menu
   */
  layout: {
    locale: false,
    ...defaultSettings,
  },
  /**
   * @name tailwindcss 插件
   * @doc https://umijs.org/docs/guides/generator#tailwind-css-%E9%85%8D%E7%BD%AE%E7%94%9F%E6%88%90%E5%99%A8
   */
  tailwindcss: {},
  /**
   * @name 约定式路由规则
   * @doc https://umijs.org/docs/api/config#conventionroutes
   */
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//],
  },
  /**
   * @name icons 插件
   * @doc https://umijs.org/docs/api/config#icons
   */
  icons: {
    include: icons,
  },
})
