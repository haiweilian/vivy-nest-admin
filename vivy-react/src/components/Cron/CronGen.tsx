import { Tabs } from 'antd'
import 'cronstrue/locales/zh_CN'
import { useState, useEffect } from 'react'
import CronGenItem from './CronGenItem'

const CronGen: React.FC<{
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

  useEffect(() => {
    const value = [
      ...(items.second !== '' ? [items.second] : []),
      items.minute,
      items.hour,
      items.day,
      items.month,
      items.week,
    ].join(' ')
    onChange?.(value)
  }, [items])

  return (
    <Tabs
      type="card"
      defaultActiveKey={current}
      onChange={setCurrent}
      items={[
        {
          key: 'second',
          label: '秒',
          children: <CronGenItem type="second" onChange={(value) => changeItems('second', value)} />,
        },
        {
          key: 'minute',
          label: '分',
          children: <CronGenItem type="minute" onChange={(value) => changeItems('minute', value)} />,
        },
        {
          key: 'hour',
          label: '时',
          children: <CronGenItem type="hour" onChange={(value) => changeItems('hour', value)} />,
        },
        {
          key: 'day',
          label: '日',
          children: <CronGenItem type="day" onChange={(value) => changeItems('day', value)} />,
        },
        {
          key: 'month',
          label: '月',
          children: <CronGenItem type="month" onChange={(value) => changeItems('month', value)} />,
        },
        {
          key: 'week',
          label: '周',
          children: <CronGenItem type="week" onChange={(value) => changeItems('week', value)} />,
        },
      ]}
    />
  )
}

export default CronGen
