import { Injectable } from '@nestjs/common'
import { Request, Response } from 'express'
import { ClsService, CLS_ID, CLS_REQ, CLS_RES } from 'nestjs-cls'

/**
 * 请求上下文
 * https://github.com/Papooch/nestjs-cls
 */
@Injectable()
export class RequestContextService {
  constructor(private clsService: ClsService) {}

  /**
   * 获取 id
   */
  getId(): number {
    return this.clsService.get(CLS_ID)
  }

  /**
   * 获取 request
   */
  getRequest(): Request {
    return this.clsService.get(CLS_REQ)
  }

  /**
   * 获取 response
   */
  getResponse(): Response {
    return this.clsService.get(CLS_RES)
  }
}
