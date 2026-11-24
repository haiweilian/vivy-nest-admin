import { OmitType } from '@nestjs/mapped-types'
import { SysMenu } from '../entities/sys-menu.entity.js'

/**
 * 添加菜单
 */
export class CreateMenuDto extends OmitType(SysMenu, ['menuId'] as const) {}

/**
 * 更新菜单
 */
export class UpdateMenuDto extends OmitType(SysMenu, ['menuId'] as const) {}
