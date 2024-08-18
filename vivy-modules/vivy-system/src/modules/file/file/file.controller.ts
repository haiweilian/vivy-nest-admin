import { Body, Controller, Get, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { UploadFileUrl, UploadFileUrls } from '../upload/upload.decorator'
import { CreateFileDto, ListFileDto } from './dto/file.dto'
import { FileService } from './file.service'

/**
 * 文件管理
 * @author vivy
 */
@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  /**
   * 文件列表
   * @param file 文件信息
   * @returns 文件列表
   */
  @Get()
  async list(@Query() file: ListFileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.list(file))
  }

  /**
   * 添加文件
   * @param file 文件信息
   */
  @Post()
  @Log({ title: '文件管理', operType: OperType.INSERT })
  async add(@Body() file: CreateFileDto | CreateFileDto[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.add(file))
  }

  /**
   * 文件用途选项
   * @returns 文件用途选项列表
   */
  @Get('useOptions')
  async useOptions(): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.useOptions())
  }

  /**
   * 单个文件上传
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @UploadFileUrl() url: string): Promise<AjaxResult> {
    console.log(url, file)
    return AjaxResult.success(url)
  }

  /**
   * 多个文件上传
   */
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadedFiles() files: Express.Multer.File[], @UploadFileUrls() urls: string[]): Promise<AjaxResult> {
    console.log(urls, files)
    return AjaxResult.success(urls)
  }
}
