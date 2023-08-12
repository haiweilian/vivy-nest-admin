import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto'
import { MenuService } from './menu.service'

/**
 * 菜单管理
 * @author vivy
 */
@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  /**
   * 查询菜单树结构
   */
  @Get('tree')
  @RequirePermissions('system:menu:query')
  async tree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.tree())
  }

  /**
   * 添加菜单
   * @param menu 菜单信息
   */
  @Post('add')
  @Log({ title: '菜单管理', operType: OperType.INSERT })
  @RequirePermissions('system:menu:add')
  async add(@Body() menu: CreateMenuDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.add(menu))
  }

  /**
   * 更新菜单
   * @param menu 菜单信息
   */
  @Put('update')
  @Log({ title: '菜单管理', operType: OperType.UPDATE })
  @RequirePermissions('system:menu:update')
  async update(@Body() menu: UpdateMenuDto): Promise<AjaxResult> {
    if (menu.menuId === menu.parentId) {
      return AjaxResult.error(`修改菜单${menu.menuName}失败，上级菜单不能是自己`)
    }

    return AjaxResult.success(await this.menuService.update(menu))
  }

  /**
   * 删除菜单
   * @param menuId 菜单ID
   */
  @Delete('delete/:menuId')
  @Log({ title: '菜单管理', operType: OperType.DELETE })
  @RequirePermissions('system:menu:delete')
  async delete(@Param('menuId') menuId: number): Promise<AjaxResult> {
    if (await this.menuService.checkMenuExistChild(menuId)) {
      return AjaxResult.error('存在下级菜单,不允许删除')
    }

    if (await this.menuService.checkMenuExistRole(menuId)) {
      return AjaxResult.error('菜单已分配角色,不允许删除')
    }

    return AjaxResult.success(await this.menuService.delete(menuId))
  }

  /**
   * 菜单详情
   * @param menuId 菜单ID
   * @returns 菜单详情
   */
  @Get('info/:menuId')
  @RequirePermissions('system:menu:query')
  async info(@Param('menuId') menuId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.info(menuId))
  }

  /**
   * 查询菜单选项树
   * @returns 菜单选项树
   */
  @Get('selectable/menuTree')
  async selectableMenuTree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.selectableMenuTree())
  }
}
