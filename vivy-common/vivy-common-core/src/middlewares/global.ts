import { RequestHandler } from 'express'
import { ServeFaviconMiddleware } from './serve-favicon.middleware.js'

export const NestGlobalMiddlewares: RequestHandler[] = [ServeFaviconMiddleware]
