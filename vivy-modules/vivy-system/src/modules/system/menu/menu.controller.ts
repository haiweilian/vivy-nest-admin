import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
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
@Controller('menus')
export class MenuController {
  constructor(
    private menuService: MenuService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 查询菜单树结构
   */
  @Get('tree')
  @RequirePermissions('system:menu:list')
  async tree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.tree())
  }

  /**
   * 添加菜单
   * @param menu 菜单信息
   */
  @Post()
  @Log({ title: '菜单管理', operType: OperType.INSERT })
  @RequirePermissions('system:menu:add')
  async add(@Body() menu: CreateMenuDto): Promise<AjaxResult> {
    menu.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.menuService.add(menu))
  }

  /**
   * 更新菜单
   * @param menu 菜单信息
   */
  @Put(':menuId')
  @Log({ title: '菜单管理', operType: OperType.UPDATE })
  @RequirePermissions('system:menu:update')
  async update(@Param('menuId') menuId: number, @Body() menu: UpdateMenuDto): Promise<AjaxResult> {
    if (menuId === menu.parentId) {
      return AjaxResult.error(`修改菜单${menu.menuName}失败，上级菜单不能是自己`)
    }

    menu.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.menuService.update(menuId, menu))
  }

  /**
   * 删除菜单
   * @param menuId 菜单ID
   */
  @Delete(':menuId')
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
   * 查询菜单选项树
   * @returns 菜单选项树
   */
  @Get('treeOptions')
  async treeOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.treeOptions())
  }

  /**
   * 菜单详情
   * @param menuId 菜单ID
   * @returns 菜单详情
   */
  @Get(':menuId')
  @RequirePermissions('system:menu:query')
  async info(@Param('menuId') menuId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.menuService.info(menuId))
  }
}
