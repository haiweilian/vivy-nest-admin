import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { RequirePermissions } from '@vivy-common/security'
import { ListOnlineDto } from './dto/online.dto'
import { OnlineService } from './online.service'

/**
 * 在线用户
 * @author vivy
 */
@ApiTags('在线用户')
@ApiBearerAuth()
@Controller('online')
export class OnlineController {
  constructor(private onlineService: OnlineService) {}

  /**
   * 在线用户列表
   * @param dto 查询信息
   * @returns 在线用户列表
   */
  @Get('list')
  @RequirePermissions('monitor:online:list')
  async list(@Query() dto: ListOnlineDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineService.list(dto))
  }

  /**
   * 强退在线用户
   * @param userSk 用户会话编号
   */
  @Delete(':userSk')
  @RequirePermissions('monitor:online:logout')
  async logout(@Param('userSk') userSk: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.onlineService.logout(userSk))
  }
}
