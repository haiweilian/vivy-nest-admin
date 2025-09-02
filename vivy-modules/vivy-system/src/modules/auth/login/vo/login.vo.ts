/**
 * 验证码
 */
export class CaptchaVo {
  /* 验证码 img */
  img: string

  /* 验证码 uuid */
  uuid: string
}

/**
 * 路由树
 */
export class RouterTreeVo {
  /** 菜单的名字 */
  name: string

  /** 路径,可以设定为网页链接 */
  path: string

  /** 菜单的 icon */
  icon: string

  /** 自定义菜单的国际化 key */
  locale: string | false

  /** 组件路径，通过路径找到组件元素 */
  component: string

  /** 子菜单 */
  children: RouterTreeVo[]

  /** 在菜单中隐藏自己和子节点 */
  hideInMenu: boolean

  /** 在菜单中隐藏子节点 */
  hideChildrenInMenu: boolean

  /** 当此节点被选中的时候也会选中 parentKeys 的节点 */
  parentKeys: string[]
}

/**
 * 路由树 Vue 路由
 */
export class RouterTreeVueVo {
  /** 子路由地址 */
  path: string

  /** 路由名字（对应不要重复，和当前组件的`name`保持一致） */
  name?: string

  /** 路由重定向 */
  redirect?: string

  /** 按需加载组件 */
  component?: string

  /** 源数据配置项 */
  meta?: {
    /** 菜单名称（兼容国际化、非国际化，如何用国际化的写法就必须在根目录的`locales`文件夹下对应添加） `必填` */
    title?: string
    /** 菜单图标 `可选` */
    icon?: string
    /** 菜单名称右侧的额外图标 `可选` */
    extraIcon?: string
    /** 是否在菜单中显示（默认`true`）`可选` */
    showLink?: boolean
    /** 是否显示父级菜单 `可选` */
    showParent?: boolean
    /** 页面级别权限设置 `可选` */
    roles?: Array<string>
    /** 按钮级别权限设置 `可选` */
    auths?: Array<string>
    /** 路由组件缓存（开启 `true`、关闭 `false`）`可选` */
    keepAlive?: boolean
    /** 内嵌的`iframe`链接 `可选` */
    frameSrc?: string
    /** `iframe`页是否开启首次加载动画（默认`true`）`可选` */
    frameLoading?: boolean
    /** 页面加载动画（两种模式，第二种权重更高，第一种直接采用`vue`内置的`transitions`动画，第二种是使用`animate.css`编写进、离场动画，平台更推荐使用第二种模式，已经内置了`animate.css`，直接写对应的动画名即可）`可选` */
    transition?: {
      /**
       * @description 当前路由动画效果
       * @see {@link https://next.router.vuejs.org/guide/advanced/transitions.html#transitions}
       * @see animate.css {@link https://animate.style}
       */
      name?: string
      /** 进场动画 */
      enterTransition?: string
      /** 离场动画 */
      leaveTransition?: string
    }
    /** 当前菜单名称或自定义信息禁止添加到标签页（默认`false`） */
    hiddenTag?: boolean
    /** 当前菜单名称是否固定显示在标签页且不可关闭（默认`false`） */
    fixedTag?: boolean
    /** 动态路由可打开的最大数量 `可选` */
    dynamicLevel?: number
    /** 将某个菜单激活
     * （主要用于通过`query`或`params`传参的路由，当它们通过配置`showLink: false`后不在菜单中显示，就不会有任何菜单高亮，
     * 而通过设置`activePath`指定激活菜单即可获得高亮，`activePath`为指定激活菜单的`path`）
     */
    activePath?: string
  }

  /** 子路由配置项 */
  children?: Array<RouterTreeVueVo>
}
