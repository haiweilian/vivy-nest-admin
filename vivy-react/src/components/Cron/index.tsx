import parser from 'cron-parser'
import CronTab from './CronTab'

const cronValidate = (value: string) => {
  try {
    parser.parseExpression(value)
    return true
  } catch (e) {
    return false
  }
}

export { CronTab, cronValidate }
