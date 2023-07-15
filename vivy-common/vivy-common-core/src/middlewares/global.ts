import { RequestHandler } from 'express'
import { ServeFaviconMiddleware } from './serve-favicon.middleware'

export const NestGlobalMiddlewares: RequestHandler[] = [ServeFaviconMiddleware]
