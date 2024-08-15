import { Body, Controller, Get, Put, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { FileService } from '@/modules/file/file/file.service'
import { UpdatePasswordDto, UpdateProfileDto } from './dto/profile.dto'
import { ProfileService } from './profile.service'

/**
 * 个人信息
 * @author vivy
 */
@ApiTags('个人信息')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private fileService: FileService
  ) {}

  /**
   * 查询个人信息
   */
  @Get()
  async info(): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.info())
  }

  /**
   * 修改个人信息
   */
  @Put()
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  async update(@Body() profile: UpdateProfileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.update(profile))
  }

  /**
   * 修改个人密码
   */
  @Put('password')
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  async password(@Body() password: UpdatePasswordDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.password(password))
  }

  /**
   * 修改个人头像
   */
  @Post('avatar')
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  @UseInterceptors(FileInterceptor('file'))
  async avatar(@UploadedFile() file: Express.Multer.File): Promise<AjaxResult> {
    const { fileUrl } = await this.fileService.upload(file, { path: 'avatar' })
    await this.profileService.avatar(fileUrl)
    return AjaxResult.success(fileUrl)
  }
}
