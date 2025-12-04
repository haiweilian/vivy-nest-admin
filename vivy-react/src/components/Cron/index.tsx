import { CronExpressionParser } from 'cron-parser'
import CronEval from './CronEval'
import CronTab from './CronTab'

const cronValidate = (value: string) => {
  try {
    CronExpressionParser.parse(value)
    return true
  } catch (e) {
    return false
  }
}

export { CronTab, CronEval, cronValidate }
