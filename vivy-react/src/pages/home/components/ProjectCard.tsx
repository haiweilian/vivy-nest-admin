import { Icon } from '@umijs/max'
import { Card, Typography } from 'antd'

export const items = [
  {
    title: 'Github',
    icon: 'ion:logo-github',
    color: '',
    desc: '不要等待机会，而要创造机会。',
    group: '开源组',
    date: '2023-09-14',
  },
  {
    title: 'Vue',
    icon: 'ion:logo-vue',
    color: '#3fb27f',
    desc: '现在的你决定将来的你。',
    group: '算法组',
    date: '2023-09-14',
  },
  {
    title: 'Html5',
    icon: 'ion:logo-html5',
    color: '#e18525',
    desc: '没有什么才能比努力更重要。',
    group: '上班摸鱼',
    date: '2023-09-14',
  },
  {
    title: 'Angular',
    icon: 'ion:logo-angular',
    color: '#bf0c2c',
    desc: '热情和欲望可以突破一切难关。',
    group: 'UI',
    date: '2023-09-14',
  },
  {
    title: 'React',
    icon: 'ion:logo-react',
    color: '#00d8ff',
    desc: '健康的身体是实目标的基石。',
    group: '技术牛',
    date: '2023-09-14',
  },
  {
    title: 'Js',
    icon: 'ion:logo-javascript',
    color: '#4daf1bc9',
    desc: '路是走出来的，而不是空想出来的。',
    group: '架构组',
    date: '2023-09-14',
  },
]

export default () => {
  return (
    <Card title="项目" extra={<Typography.Link>更多</Typography.Link>} className="w-full">
      {items.map((item) => (
        <Card.Grid key={item.title}>
          <span className="flex">
            <Icon icon={item.icon as any} color={item.color} width="30px" height="30px" />
            <span className="ml-4 text-lg">{item.title}</span>
          </span>
          <Typography.Text type="secondary" className="flex h-10 mt-2">
            {item.desc}
          </Typography.Text>
          <Typography.Text type="secondary" className="flex justify-between">
            <span>{item.group}</span>
            <span>{item.date}</span>
          </Typography.Text>
        </Card.Grid>
      ))}
    </Card>
  )
}
