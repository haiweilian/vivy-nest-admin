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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { ListFileDto, CreateFileDto, UpdateFileDto, UploadConfigDto, UploadsConfigDto } from './dto/file.dto'
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
  async add(@Body() file: CreateFileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.add(file))
  }

  /**
   * 更新文件
   * @param fileId 文件ID
   * @param file 文件信息
   */
  @Put(':fileId')
  @Log({ title: '文件管理', operType: OperType.UPDATE })
  async update(@Param('fileId') fileId: number, @Body() file: UpdateFileDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.update(fileId, file))
  }

  /**
   * 删除文件
   * @param fileIds 文件ID
   */
  @Delete(':fileIds')
  @Log({ title: '文件管理', operType: OperType.DELETE })
  async delete(@Param('fileIds', new ParseArrayPipe({ items: Number })) fileIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.delete(fileIds))
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
   * 文件详情
   * @param fileId 文件ID
   * @returns 文件详情
   */
  @Get(':fileId')
  async info(@Param('fileId') fileId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.fileService.info(fileId))
  }

  /**
   * 单个文件上传
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() config: UploadConfigDto): Promise<AjaxResult> {
    const result = await this.fileService.upload(file, config)
    return AjaxResult.success(result)
  }

  /**
   * 多个文件上传
   */
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(@UploadedFiles() files: Express.Multer.File[], @Body() config: UploadsConfigDto): Promise<AjaxResult> {
    const result = []
    for (const [i, file] of files.entries()) {
      result.push(
        await this.fileService.upload(file, {
          path: config.path?.[i],
          name: config.name?.[i],
        })
      )
    }
    return AjaxResult.success(result)
  }
}
