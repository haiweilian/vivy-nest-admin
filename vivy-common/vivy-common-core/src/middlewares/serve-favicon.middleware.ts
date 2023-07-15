import * as path from 'path'
import { RequestHandler } from 'express'
import * as favicon from 'serve-favicon'

/**
 * Favicon 中间件
 * https://www.npmjs.com/package/serve-favicon
 */
export const ServeFaviconMiddleware: RequestHandler = favicon(path.join(__dirname, '../assets/favicon.ico'))
