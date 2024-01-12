import { SetMetadata } from '@nestjs/common'
import { TASKABLE_METADATA } from './job.constants'

/**
 * 标记为定时任务
 */
export const Taskable = () => {
  return SetMetadata(TASKABLE_METADATA, true)
}
