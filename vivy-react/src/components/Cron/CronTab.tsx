import { Col, Row, Tabs, Input } from 'antd'
import parser from 'cron-parser'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import CronTabItem from './CronTabItem'

const CronTab: React.FC<{
  onChange?: (value: string) => void
}> = ({ onChange }) => {
  const [current, setCurrent] = useState('minute')

  const [items, setItems] = useState({
    second: '',
    minute: '*',
    hour: '*',
    day: '*',
    month: '*',
    week: '*',
  })
  const changeItems = (key: string, value: string) => {
    setItems({
      ...items,
      [key]: value,
    })
  }

  const value = useMemo(() => {
    return [
      ...(items.second !== '' ? [items.second] : []),
      items.minute,
      items.hour,
      items.day,
      items.month,
      items.week,
    ].join(' ')
  }, [items])

  const [output, setOutput] = useState('')
  useEffect(() => {
    onChange?.(value)

    const output: string[] = []
    try {
      output.push(`生成结果：${value}`, '')
      output.push('最近10次执行时间')
      const interval = parser.parseExpression(value)
      for (let i = 1; i <= 10; i++) {
        output.push(`第${i}次: ${dayjs(interval.next().toString()).format('YYYY-MM-DD HH:mm:ss')}`)
      }
    } catch (e: any) {
      output.push(e.message)
    }
    setOutput(output.join('\n'))
  }, [value])

  return (
    <Row>
      <Col span={14}>
        <Tabs
          type="card"
          defaultActiveKey={current}
          onChange={setCurrent}
          items={[
            {
              key: 'second',
              label: '秒',
              children: <CronTabItem type="second" onChange={(value) => changeItems('second', value)} />,
            },
            {
              key: 'minute',
              label: '分',
              children: <CronTabItem type="minute" onChange={(value) => changeItems('minute', value)} />,
            },
            {
              key: 'hour',
              label: '时',
              children: <CronTabItem type="hour" onChange={(value) => changeItems('hour', value)} />,
            },
            {
              key: 'day',
              label: '日',
              children: <CronTabItem type="day" onChange={(value) => changeItems('day', value)} />,
            },
            {
              key: 'month',
              label: '月',
              children: <CronTabItem type="month" onChange={(value) => changeItems('month', value)} />,
            },
            {
              key: 'week',
              label: '周',
              children: <CronTabItem type="week" onChange={(value) => changeItems('week', value)} />,
            },
          ]}
        />
      </Col>
      <Col span={10}>
        <Input.TextArea value={output} style={{ height: '100%' }}></Input.TextArea>
      </Col>
    </Row>
  )
}

export default CronTab
