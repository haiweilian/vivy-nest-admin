import type { Settings as LayoutSettings } from '@ant-design/pro-components'
import defaultSettings from '../../config/setting'

const TokenKey = 'Vivy-Theme-Setting'

export function getThemeSetting(): Partial<LayoutSettings> {
  const value = localStorage.getItem(TokenKey)
  return value
    ? {
        ...defaultSettings,
        ...JSON.parse(value),
      }
    : (defaultSettings as LayoutSettings)
}

export function setThemeSetting(setting: Partial<LayoutSettings>) {
  localStorage.setItem(TokenKey, JSON.stringify(setting))
  document.querySelector('body')!.classList.remove('dark', 'light')
  document.querySelector('body')!.classList.add(setting.navTheme === 'realDark' ? 'dark' : 'light')
}
