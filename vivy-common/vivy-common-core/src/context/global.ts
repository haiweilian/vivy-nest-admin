import { RequestContext } from './request.context'
import { SecurityContext } from './security.context'

export const NestGlobalContext = [RequestContext, SecurityContext]
