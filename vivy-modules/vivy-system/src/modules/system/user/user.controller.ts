import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
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
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 用户列表
   * @param user 用户信息
   * @returns 用户列表
   */
  @Get()
  @RequirePermissions('system:user:list')
  async list(@Query() user: ListUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.list(user))
  }

  /**
   * 添加用户
   * @param user 用户信息
   */
  @Post()
  @Log({ title: '用户管理', operType: OperType.INSERT })
  @RequirePermissions('system:user:add')
  async add(@Body() user: CreateUserDto): Promise<AjaxResult> {
    if (!(await this.userService.checkUserNameUnique(user.userName))) {
      return AjaxResult.error(`新增用户${user.userName}失败，登录账号已存在`)
    }

    if (!(await this.userService.checkUserEmailUnique(user.email))) {
      return AjaxResult.error(`新增用户${user.userName}失败，邮箱账号已存在`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user.phonenumber))) {
      return AjaxResult.error(`新增用户${user.userName}失败，手机号码已存在`)
    }

    user.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.userService.add(user))
  }

  /**
   * 更新用户
   * @param userId 用户ID
   * @param user 用户信息
   */
  @Put(':userId')
  @Log({ title: '用户管理', operType: OperType.UPDATE })
  @RequirePermissions('system:user:update')
  async update(@Param('userId') userId: number, @Body() user: UpdateUserDto): Promise<AjaxResult> {
    this.userService.checkUserAllowed(user)

    if (!(await this.userService.checkUserNameUnique(user.userName, userId))) {
      return AjaxResult.error(`修改用户${user.userName}失败，登录账号已存在`)
    }

    if (!(await this.userService.checkUserEmailUnique(user.email, userId))) {
      return AjaxResult.error(`修改用户${user.userName}失败，邮箱账号已存在`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user.phonenumber, userId))) {
      return AjaxResult.error(`修改用户${user.userName}失败，手机号码已存在`)
    }

    user.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.userService.update(userId, user))
  }

  /**
   * 删除用户
   * @param userIds 用户ID
   */
  @Delete(':userIds')
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
  @Get(':userId')
  @RequirePermissions('system:user:query')
  async info(@Param('userId') userId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.info(userId))
  }

  /**
   * 导出用户
   */
  @Post('export')
  @Log({ title: '用户管理', operType: OperType.EXPORT })
  @RequirePermissions('system:user:export')
  async export() {
    const file = await this.userService.export()
    return new StreamableFile(file)
  }

  /**
   * 导出模板
   */
  @Post('export-template')
  @Log({ title: '用户管理', operType: OperType.EXPORT })
  @RequirePermissions('system:user:export')
  async exportTemplate() {
    const file = await this.userService.exportTemplate()
    return new StreamableFile(file)
  }

  /**
   * 导入用户
   */
  @Post('import')
  @Log({ title: '用户管理', operType: OperType.IMPORT })
  @RequirePermissions('system:user:import')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file: Express.Multer.File) {
    return AjaxResult.success(await this.userService.import(file.buffer))
  }
}
