import { Provider } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { RepeatSubmitGuard } from './repeat-submit.guard'

export const NestGlobalGuards: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: RepeatSubmitGuard,
  },
]
