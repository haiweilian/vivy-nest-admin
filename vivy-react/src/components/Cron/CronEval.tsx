import { Input } from 'antd'
import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'
import 'cronstrue/locales/zh_CN'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const CronEval: React.FC<{
  value?: string
}> = ({ value }) => {
  const output = useMemo<string>(() => {
    if (!value) return '无表达式'

    const output: string[] = []
    try {
      const interval = CronExpressionParser.parse(value)
      const description = cronstrue.toString(value, { locale: 'zh_CN', use24HourTimeFormat: true })
      output.push(`表达式：${value}`, '')
      output.push(`表达式描述：${description}`, '')
      output.push('最近10次执行时间')
      for (let i = 1; i <= 10; i++) {
        output.push(`第${i}次: ${dayjs(interval.next().toString()).format('YYYY-MM-DD HH:mm:ss')}`)
      }
    } catch (e: any) {
      output.push(e.message)
    }

    return output.join('\n')
  }, [value])

  return <Input.TextArea value={output} style={{ height: '100%' }}></Input.TextArea>
}

export default CronEval
