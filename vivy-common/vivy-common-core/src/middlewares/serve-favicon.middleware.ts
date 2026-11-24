import { resolve } from 'path'
import { RequestHandler } from 'express'
import favicon from 'serve-favicon'

/**
 * Favicon 中间件
 * https://www.npmjs.com/package/serve-favicon
 */
export const ServeFaviconMiddleware: RequestHandler = favicon(resolve(import.meta.dirname, '../assets/favicon.ico'))
