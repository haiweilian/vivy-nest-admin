import { SetMetadata } from '@nestjs/common'

export class RepeatSubmitOptions {
  /**
   * 间隔时间
   * @default 5s
   */
  interval?: number = 5

  /**
   * 错误消息
   * @default
   */
  message?: string = '请求过于频繁'
}

export const REPEAT_SUBMIT_METADATA = 'REPEAT_SUBMIT_METADATA'

/**
 * 防止重复提交装饰器
 * @param options 配置
 * @returns MethodDecorator
 */
export const RepeatSubmit = (options?: RepeatSubmitOptions) => {
  return SetMetadata(REPEAT_SUBMIT_METADATA, Object.assign(new RepeatSubmitOptions(), options))
}
