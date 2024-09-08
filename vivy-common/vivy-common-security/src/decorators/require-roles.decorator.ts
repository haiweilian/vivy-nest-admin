import { SetMetadata } from '@nestjs/common'
import { isArray } from 'lodash'
import { Logical } from '../enums/logical.enum'
import { REQUIRE_ROLES_METADATA } from '../security.constants'

/**
 * 角色认证：必须具有指定角色标识才能进入该方法
 * @param value 需要校验的角色标识
 * @param logical 验证逻辑：AND | OR，默认AND
 */
export const RequireRoles = (value: string | string[], logical: Logical = Logical.AND) => {
  return SetMetadata(REQUIRE_ROLES_METADATA, {
    value: isArray(value) ? value : [value],
    logical,
  })
}
