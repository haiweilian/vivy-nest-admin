import { RequestContext } from './request.context.js'
import { SecurityContext } from './security.context.js'

export const NestGlobalContext = [RequestContext, SecurityContext]
