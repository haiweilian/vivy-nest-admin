import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
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
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 角色列表
   * @param role 角色信息
   * @returns 角色列表
   */
  @Get()
  @RequirePermissions('system:role:list')
  async list(@Query() role: ListRoleDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.list(role))
  }

  /**
   * 添加角色
   * @param role 角色信息
   */
  @Post()
  @Log({ title: '角色管理', operType: OperType.INSERT })
  @RequirePermissions('system:role:add')
  async add(@Body() role: CreateRoleDto): Promise<AjaxResult> {
    if (!(await this.roleService.checkRoleNameUnique(role.roleName))) {
      return AjaxResult.error(`新增角色${role.roleName}失败，角色名称已存在`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role.roleCode))) {
      return AjaxResult.error(`新增角色${role.roleName}失败，角色权限已存在`)
    }

    role.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.roleService.add(role))
  }

  /**
   * 更新角色
   * @param roleId 角色ID
   * @param role 角色信息
   */
  @Put(':roleId')
  @Log({ title: '角色管理', operType: OperType.UPDATE })
  @RequirePermissions('system:role:update')
  async update(@Param('roleId') roleId: number, @Body() role: UpdateRoleDto): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleId)

    if (!(await this.roleService.checkRoleNameUnique(role.roleName, roleId))) {
      return AjaxResult.error(`修改角色${role.roleName}失败，角色名称已存在`)
    }

    if (!(await this.roleService.checkRoleCodeUnique(role.roleCode, roleId))) {
      return AjaxResult.error(`修改角色${role.roleName}失败，角色权限已存在`)
    }

    role.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.roleService.update(roleId, role))
  }

  /**
   * 删除角色
   * @param roleIds 角色ID
   */
  @Delete(':roleIds')
  @Log({ title: '角色管理', operType: OperType.DELETE })
  @RequirePermissions('system:role:delete')
  async delete(@Param('roleIds', new ParseArrayPipe({ items: Number })) roleIds: number[]): Promise<AjaxResult> {
    this.roleService.checkRoleAllowed(roleIds)
    return AjaxResult.success(await this.roleService.delete(roleIds))
  }

  /**
   * 角色选项列表
   * @returns 角色选项列表
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.options())
  }

  /**
   * 角色详情
   * @param roleId 角色ID
   * @returns 角色详情
   */
  @Get(':roleId')
  @RequirePermissions('system:role:query')
  async info(@Param('roleId') roleId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.roleService.info(roleId))
  }
}
