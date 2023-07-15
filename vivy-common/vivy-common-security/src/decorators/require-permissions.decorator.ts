import { SetMetadata } from '@nestjs/common'
import { isArray } from 'lodash'
import { Logical } from '../enums/logical.enums'
import { REQUIRE_PERMISSIONS_METADATA } from '../security.constants'

/**
 * 权限认证：必须具有指定权限才能进入该方法
 * @param value 需要校验的权限码
 * @param logical 验证逻辑：AND | OR，默认AND
 */
export const RequirePermissions = (value: string | string[], logical: Logical = Logical.AND) => {
  return SetMetadata(REQUIRE_PERMISSIONS_METADATA, {
    value: isArray(value) ? value : [value],
    logical,
  })
}
