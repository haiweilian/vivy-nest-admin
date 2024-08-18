import { randomUUID } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { Request } from 'express'
import * as mime from 'mime'
import * as multer from 'multer'
import { UploadOptions, UploadClientOptions, UPLOAD_FILE_URL } from './upload.config'

/**
 * 拼接路径
 * @param paths 路径
 * @returns 路径
 */
export const joinPath = (...paths: string[]) => {
  return path.join(...paths.map((p) => p || ''))
}

/**
 * 标准化名称
 * @param file 文件信息
 * @returns 文件名称
 */
export const formatName = (file: Express.Multer.File) => {
  const originalname = file.originalname
  if (originalname.includes('.')) {
    return originalname
  } else {
    return originalname + '.' + mime.getExtension(file.mimetype)
  }
}

/**
 * 生成随机名称
 * @param filename 文件名称
 * @returns 随机名称
 */
export const randomName = (filename: string) => {
  const now = Date.now()
  const uuid = randomUUID().replace(/-/g, '')
  return `${now}${uuid}${path.extname(filename)}`
}

/**
 * 自定义 Multer 存储器
 */
export const uploadStorage = (options: UploadOptions) => {
  return multer.diskStorage({
    destination(req: Request, file: Express.Multer.File, cb) {
      const uploadOptions: UploadOptions = options
      const clientOptions: UploadClientOptions = req.body

      const localPath = joinPath(uploadOptions.path, clientOptions.path)
      fs.mkdirSync(localPath, { recursive: true })

      cb(null, localPath)
    },
    filename(req: Request, file: Express.Multer.File, cb) {
      const uploadOptions: UploadOptions = options
      const clientOptions: UploadClientOptions = req.body
      const filename = formatName(file)
      const randomname = randomName(filename)

      const fileurl = joinPath(uploadOptions.domain, uploadOptions.prefix, clientOptions.path, randomname)
      file[UPLOAD_FILE_URL] = fileurl

      cb(null, randomname)
    },
  })
}
