import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { DeptService } from './dept.service'
import { CreateDeptDto, UpdateDeptDto } from './dto/dept.dto'

/**
 * 部门管理
 * @author vivy
 */
@ApiTags('部门管理')
@ApiBearerAuth()
@Controller('depts')
export class DeptController {
  constructor(
    private deptService: DeptService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 查询部门树结构
   */
  @Get('tree')
  @RequirePermissions('system:dept:list')
  async tree(): Promise<AjaxResult> {
    return AjaxResult.success(await this.deptService.tree())
  }

  /**
   * 添加部门
   * @param dept 部门信息
   */
  @Post()
  @Log({ title: '部门管理', operType: OperType.INSERT })
  @RequirePermissions('system:dept:add')
  async add(@Body() dept: CreateDeptDto): Promise<AjaxResult> {
    dept.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.deptService.add(dept))
  }

  /**
   * 更新部门
   * @param deptId 部门ID
   * @param dept 部门信息
   */
  @Put(':deptId')
  @Log({ title: '部门管理', operType: OperType.UPDATE })
  @RequirePermissions('system:dept:update')
  async update(@Param('deptId') deptId: number, @Body() dept: UpdateDeptDto): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)

    if (deptId === dept.parentId) {
      return AjaxResult.error(`修改部门${dept.deptName}失败，上级部门不能是自己`)
    }

    dept.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.deptService.update(deptId, dept))
  }

  /**
   * 删除部门
   * @param deptId 部门ID
   */
  @Delete(':deptId')
  @Log({ title: '部门管理', operType: OperType.DELETE })
  @RequirePermissions('system:dept:delete')
  async delete(@Param('deptId') deptId: number): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)

    if (await this.deptService.checkDeptExistChild(deptId)) {
      return AjaxResult.error('存在下级部门,不允许删除')
    }

    if (await this.deptService.checkDeptExistUser(deptId)) {
      return AjaxResult.error('部门存在用户,不允许删除')
    }

    return AjaxResult.success(await this.deptService.delete(deptId))
  }

  /**
   * 查询部门选项树
   * @returns 部门选项树
   */
  @Get('tree-options')
  async treeOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.deptService.treeOptions())
  }

  /**
   * 部门详情
   * @param deptId 部门ID
   * @returns 部门详情
   */
  @Get(':deptId')
  @RequirePermissions('system:dept:query')
  async info(@Param('deptId') deptId: number): Promise<AjaxResult> {
    await this.deptService.checkDeptDataScope(deptId)
    return AjaxResult.success(await this.deptService.info(deptId))
  }
}
