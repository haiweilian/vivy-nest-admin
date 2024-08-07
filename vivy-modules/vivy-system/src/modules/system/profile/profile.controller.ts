import { Body, Controller, Get, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, UserName } from '@vivy-common/core'
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
  async profile(@UserName() userName: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.profile(userName))
  }

  /**
   * 修改个人信息
   */
  @Put('updateProfile')
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  async updateProfile(@Body() profile: UpdateProfileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.updateProfile(profile))
  }

  /**
   * 修改个人密码
   */
  @Put('updatePassword')
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  async updatePassword(@Body() password: UpdatePasswordDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.profileService.updatePassword(password))
  }

  /**
   * 修改个人头像
   */
  @Put('updateAvatar')
  @Log({ title: '个人信息', operType: OperType.UPDATE })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(@UploadedFile() file: Express.Multer.File): Promise<AjaxResult> {
    const { fileUrl } = await this.fileService.upload(file, { path: 'avatar' })
    await this.profileService.updateAvatar(fileUrl)
    return AjaxResult.success(fileUrl)
  }
}
