import { SetMetadata, applyDecorators } from '@nestjs/common'
import { INNER_AUTH_METADATA } from '../security.constants'
import { Public } from './public.decorator'

/**
 * 内部认证：只有传入内部认证标识才能进入该方法
 * @param isUser 是否校验用户信息
 */
export const InnerAuth = (isUser = false) => {
  return applyDecorators(
    Public(),
    SetMetadata(INNER_AUTH_METADATA, {
      isUser,
    })
  )
}
