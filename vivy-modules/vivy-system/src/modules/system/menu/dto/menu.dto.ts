import { OmitType } from '@nestjs/mapped-types'
import { SysMenu } from '../entities/sys-menu.entity'

/**
 * 新增
 */
export class CreateMenuDto extends OmitType(SysMenu, ['menuId'] as const) {}

/**
 * 更新
 */
export class UpdateMenuDto extends SysMenu {}
