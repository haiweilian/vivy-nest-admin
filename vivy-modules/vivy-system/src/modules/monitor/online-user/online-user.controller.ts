import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListOnlineUserDto } from './dto/online-user.dto'
import { OnlineUserService } from './online-user.service'

/**
 * 在线用户
 * @author vivy
 */
@ApiTags('在线用户')
@ApiBearerAuth()
@Controller('online-users')
export class OnlineUserController {
  constructor(private onlineUserService: OnlineUserService) {}

  /**
   * 在线用户列表
   * @param dto 查询信息
   * @returns 在线用户列表
   */
  @Get()
  @RequirePermissions('monitor:online:list')
  async list(@Query() dto: ListOnlineUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineUserService.list(dto))
  }

  /**
   * 强退在线用户
   * @param userSk 用户会话编号
   */
  @Delete(':userSk')
  @Log({ title: '在线用户', operType: OperType.DELETE })
  @RequirePermissions('monitor:online:logout')
  async logout(@Param('userSk') userSk: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineUserService.logout(userSk))
  }
}
