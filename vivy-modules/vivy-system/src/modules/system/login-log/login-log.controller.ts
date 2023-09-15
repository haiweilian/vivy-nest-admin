import { Controller, Delete, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListLoginLogDto } from './dto/login-log.dto'
import { LoginLogService } from './login-log.service'

/**
 * 登录日志
 * @author vivy
 */
@ApiTags('登录日志')
@ApiBearerAuth()
@Controller('login/log')
export class LoginLogController {
  constructor(private loginLogService: LoginLogService) {}

  /**
   * 查询登录日志列表
   * @param loginLog 登录日志信息
   * @returns 登录日志列表
   */
  @Get('list')
  @RequirePermissions('system:loginlog:list')
  async list(@Query() loginLog: ListLoginLogDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.loginLogService.list(loginLog))
  }

  /**
   * 清空登录日志
   */
  @Delete('clear')
  @Log({ title: '登录日志', operType: OperType.CLEAN })
  @RequirePermissions('system:loginlog:delete')
  async clear(): Promise<AjaxResult> {
    return AjaxResult.success(await this.loginLogService.clear())
  }
}
