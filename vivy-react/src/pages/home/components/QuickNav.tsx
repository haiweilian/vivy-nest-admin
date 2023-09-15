import { Icon } from '@umijs/max'
import { Card } from 'antd'

export const items = [
  {
    title: '首页',
    icon: 'ion:home-outline',
    color: '#1fdaca',
  },
  {
    title: '仪表盘',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
  },
  {
    title: '组件',
    icon: 'ion:layers-outline',
    color: '#e18525',
  },
  {
    title: '系统管理',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
  },
  {
    title: '权限管理',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
  },
  {
    title: '图表',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
  },
]

export default () => {
  return (
    <Card title="快捷导航" className="w-full">
      {items.map((item) => (
        <Card.Grid key={item.title}>
          <span className="flex flex-col items-center">
            <Icon icon={item.icon as any} color={item.color} width="20px" height="20px" />
            <span className="mt-2 text-md">{item.title}</span>
          </span>
        </Card.Grid>
      ))}
    </Card>
  )
}
