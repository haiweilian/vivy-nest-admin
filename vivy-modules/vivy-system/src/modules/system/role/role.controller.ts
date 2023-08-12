import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListRoleDto, CreateRoleDto, UpdateRoleDto } from './dto/role.dto'
import { RoleService } from './role.service'

/**
 * 角色管理
 * @author vivy
 */
@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  /**
   * 角色列表
   * @param role 角色信息
   * @returns 角色列表
   */
  @Get('list')
  @RequirePermissions('system:role:query')
  async list(@Query() role: ListRoleDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.list(role))
  }

  /**
   * 添加角色
   * @param role 角色信息
   */
  @Post('add')
  @Log({ title: '角色管理', operType: OperType.INSERT })
  @RequirePermissions('system:role:add')
  async add(@Body() role: CreateRoleDto): Promise<AjaxResult> {
    if (!(await this.roleService.checkRoleNameUnique(role))) {
      return AjaxResult.error(`新增角色${role.roleName}失败，角色名称已存在`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role))) {
      return AjaxResult.error(`新增角色${role.roleName}失败，角色权限已存在`)
    }

    return AjaxResult.success(await this.roleService.add(role))
  }

  /**
   * 更新角色
   * @param role 角色信息
   */
  @Put('update')
  @Log({ title: '角色管理', operType: OperType.UPDATE })
  @RequirePermissions('system:role:update')
  async update(@Body() role: UpdateRoleDto): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(role)

    if (!(await this.roleService.checkRoleNameUnique(role))) {
      return AjaxResult.error(`修改角色${role.roleName}失败，角色名称已存在`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role))) {
      return AjaxResult.error(`修改角色${role.roleName}失败，角色权限已存在`)
    }

    return AjaxResult.success(await this.roleService.update(role))
  }

  /**
   * 删除角色
   * @param roleIds 角色ID
   */
  @Delete('delete/:roleIds')
  @Log({ title: '角色管理', operType: OperType.DELETE })
  @RequirePermissions('system:role:delete')
  async delete(@Param('roleIds', new ParseArrayPipe({ items: Number })) roleIds: number[]): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleIds)
    return AjaxResult.success(await this.roleService.delete(roleIds))
  }

  /**
   * 角色详情
   * @param roleId 角色ID
   * @returns 角色详情
   */
  @Get('info/:roleId')
  @RequirePermissions('system:role:query')
  async info(@Param('roleId') roleId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.info(roleId))
  }

  /**
   * 角色选项列表
   * @returns 角色选项列表
   */
  @Get('selectable/role')
  async selectableRole(): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.selectableRole())
  }
}
