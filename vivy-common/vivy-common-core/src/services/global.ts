import { RequestContextService } from './request-context.service'
import { SecurityContextService } from './security-context.service'

export const NestGlobalServices = [RequestContextService, SecurityContextService]
