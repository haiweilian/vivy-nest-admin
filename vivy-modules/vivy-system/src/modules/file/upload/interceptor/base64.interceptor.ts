import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import * as FormData from 'form-data'

/**
 * Base64 文件拦截器，转为 multer 可以处理的数据，便于上传逻辑统一。
 */
@Injectable()
export class Base64FileInterceptor implements NestInterceptor {
  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest()

    /**
     * 如果：
     * 1. 没有 file 字段
     * 2. 或者请求本身已经是 multipart/form-data
     * 说明不是 Base64 上传，直接放行
     */
    if (!req.body?.file || req.is('multipart/form-data')) return next.handle()

    const path = req.body.path
    const base64 = req.body.file

    /**
     * 只处理 data:image/png;base64,xxxx 这种标准 DataURL Base64
     */
    if (!base64.startsWith('data:')) return next.handle()

    /**
     * 拆出 meta 与真正的 base64 数据
     * meta = data:image/png;base64
     * data = iVBORw0KGgoAAAANSUhEUg...
     */
    const [meta, data] = base64.split(',')

    /**
     * 从 meta 中解析出真实 mime
     */
    const mime = meta.match(/data:(.*);base64/)?.[1]

    /**
     * Base64 → 二进制 Buffer
     * 此时 buffer 就是一个真实的文件内容
     */
    const buffer = Buffer.from(data, 'base64')

    /**
     * 重新构建一个 multipart/form-data 请求体
     * 等价于浏览器 new FormData() 后 append file
     */
    const form = new FormData()

    /**
     * 先 append 业务字段（否则 multer 会丢字段）
     */
    if (path) form.append('path', path)

    /**
     * 构造一个真正的文件字段
     * 这个 file 会被 Multer 识别成标准上传文件
     */
    form.append('file', buffer, {
      filename: `base64.${mime.split('/')[1]}`,
      contentType: mime,
    })

    /**
     * 把原始 JSON 请求头伪装成 multipart 请求头
     */
    req.headers = {
      ...req.headers,
      ...form.getHeaders(), // content-type: multipart/form-data; boundary=xxx
    }

    /**
     * ⭐ 核心魔法
     * 把原始 req 的可读流，替换为 form-data 生成的 multipart 流
     * Multer 后面读取的“请求体”，已经变成了我们造的表单流
     */
    req.pipe = form.pipe.bind(form)

    return next.handle()
  }
}
