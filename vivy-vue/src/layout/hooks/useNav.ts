import { useGlobal, isAllEmpty } from '@pureadmin/utils'
import { useFullscreen } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, type CSSProperties } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Avatar from '@/assets/user.jpg'
import { getConfig } from '@/config'
import { router, remainingPaths } from '@/router'
import { getTopMenu } from '@/router/utils'
import { useAppStoreHook } from '@/store/modules/app'
import { usePermissionStoreHook } from '@/store/modules/permission'
import { useUserStoreHook } from '@/store/modules/user'
import { emitter } from '@/utils/mitt'
import type { routeMetaType } from '../types'
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill'
import Fullscreen from '~icons/ri/fullscreen-fill'

const errorInfo = 'The current routing configuration is incorrect, please check the configuration'

export function useNav() {
  const route = useRoute()
  const pureApp = useAppStoreHook()
  const routers = useRouter().options.routes
  const { isFullscreen, toggle } = useFullscreen()
  const { wholeMenus } = storeToRefs(usePermissionStoreHook())
  /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
  const tooltipEffect = getConfig()?.TooltipEffect ?? 'light'

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
    }
  })

  /** 头像（如果头像为空则使用 src/assets/user.jpg ） */
  const userAvatar = computed(() => {
    return isAllEmpty(useUserStoreHook()?.avatar) ? Avatar : useUserStoreHook()?.avatar
  })

  /** 昵称（如果昵称为空则显示用户名） */
  const username = computed(() => {
    return isAllEmpty(useUserStoreHook()?.nickname) ? useUserStoreHook()?.username : useUserStoreHook()?.nickname
  })

  const avatarsStyle = computed(() => {
    return username.value ? { marginRight: '10px' } : ''
  })

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus
  })

  const device = computed(() => {
    return pureApp.getDevice
  })

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>()
  const layout = computed(() => {
    return $storage?.layout?.layout
  })

  const title = computed(() => {
    return $config.Title
  })

  /** 动态title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title
    if (Title) document.title = `${meta.title} | ${Title}`
    else document.title = meta.title
  }

  /** 退出登录 */
  function logout() {
    useUserStoreHook().logout()
  }

  function backTopMenu() {
    router.push(getTopMenu()?.path)
  }

  function onPanel() {
    emitter.emit('openPanel')
  }

  function toggleSideBar() {
    pureApp.toggleSideBar()
  }

  function handleResize(menuRef) {
    menuRef?.handleResize()
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo)
    const httpReg = /^http(s?):\/\//
    const routeChildPath = route.children[0]?.path
    if (httpReg.test(routeChildPath)) {
      return route.path + '/' + routeChildPath
    } else {
      return routeChildPath
    }
  }

  function menuSelect(indexPath: string) {
    if (wholeMenus.value.length === 0 || isRemaining(indexPath)) return
    emitter.emit('changLayoutRoute', indexPath)
  }

  /** 判断路径是否参与菜单 */
  function isRemaining(path: string) {
    return remainingPaths.includes(path)
  }

  /** 获取`logo` */
  function getLogo() {
    return new URL('/logo.png', import.meta.url).href
  }

  return {
    route,
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    isFullscreen,
    Fullscreen,
    ExitFullscreen,
    toggle,
    backTopMenu,
    onPanel,
    getDivStyle,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    getLogo,
    isCollapse,
    pureApp,
    username,
    userAvatar,
    avatarsStyle,
    tooltipEffect,
  }
}
