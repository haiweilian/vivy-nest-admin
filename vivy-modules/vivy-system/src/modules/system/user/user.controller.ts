import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListUserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { UserService } from './user.service'

/**
 * 用户管理
 * @author vivy
 */
@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 用户列表
   * @param user 用户信息
   * @returns 用户列表
   */
  @Get('list')
  @RequirePermissions('system:user:query')
  async list(@Query() user: ListUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.list(user))
  }

  /**
   * 添加用户
   * @param user 用户信息
   */
  @Post('add')
  @Log({ title: '用户管理', operType: OperType.INSERT })
  @RequirePermissions('system:user:add')
  async add(@Body() user: CreateUserDto): Promise<AjaxResult> {
    if (!(await this.userService.checkUserNameUnique(user))) {
      return AjaxResult.error(`新增用户${user.userName}失败，登录账号已存在`)
    }

    return AjaxResult.success(await this.userService.add(user))
  }

  /**
   * 更新用户
   * @param user 用户信息
   */
  @Put('update')
  @Log({ title: '用户管理', operType: OperType.UPDATE })
  @RequirePermissions('system:user:update')
  async update(@Body() user: UpdateUserDto): Promise<AjaxResult> {
    this.userService.checkUserAllowed(user)

    if (!(await this.userService.checkUserNameUnique(user))) {
      return AjaxResult.error(`修改用户${user.userName}失败，登录账号已存在`)
    }

    return AjaxResult.success(await this.userService.update(user))
  }

  /**
   * 删除用户
   * @param userIds 用户ID
   */
  @Delete('delete/:userIds')
  @Log({ title: '用户管理', operType: OperType.DELETE })
  @RequirePermissions('system:user:delete')
  async delete(@Param('userIds', new ParseArrayPipe({ items: Number })) userIds: number[]): Promise<AjaxResult> {
    this.userService.checkUserAllowed(userIds)
    return AjaxResult.success(await this.userService.delete(userIds))
  }

  /**
   * 用户详情
   * @param userId 用户ID
   * @returns 用户详情
   */
  @Get('info/:userId')
  @RequirePermissions('system:user:query')
  async info(@Param('userId') userId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.info(userId))
  }
}
