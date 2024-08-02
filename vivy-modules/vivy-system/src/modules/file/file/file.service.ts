import * as fs from 'fs'
import * as path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@vivy-common/config'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { FileUtils } from '../utils/file.utils'
import { ListFileDto, CreateFileDto, UpdateFileDto, UploadConfigDto } from './dto/file.dto'
import { SysFile } from './entities/sys-file.entity'
import { UploadFileVo } from './vo/file.vo'

/**
 * 文件
 * @author vivy
 */
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(SysFile)
    private fileRepository: Repository<SysFile>,
    private configService: ConfigService
  ) {}

  /**
   * 文件列表
   * @param file 文件信息
   * @returns 文件列表
   */
  async list(file: ListFileDto): Promise<Pagination<SysFile>> {
    return paginate<SysFile>(
      this.fileRepository,
      {
        page: file.page,
        limit: file.limit,
      },
      {
        where: {
          fileUse: file.fileUse,
          fileUrl: isNotEmpty(file.fileUrl) ? Like(`%${file.fileUrl}%`) : undefined,
        },
        order: {
          createTime: 'DESC',
        },
      }
    )
  }

  /**
   * 添加文件
   * @param file 文件信息
   */
  async add(file: CreateFileDto): Promise<void> {
    await this.fileRepository.insert(file)
  }

  /**
   * 更新文件
   * @param file 文件信息
   */
  async update(file: UpdateFileDto): Promise<void> {
    await this.fileRepository.update(file.fileId, file)
  }

  /**
   * 删除文件
   * @param fileIds 文件ID
   */
  async delete(fileIds: number[]): Promise<void> {
    await this.fileRepository.delete(fileIds)
  }

  /**
   * 文件详情
   * @param fileId 文件ID
   * @returns 文件详情
   */
  async info(fileId: number): Promise<SysFile> {
    return this.fileRepository.findOneBy({ fileId })
  }

  /**
   * 文件用途选项
   * @returns 文件用途选项列表
   */
  async useOptions(): Promise<string[]> {
    const data = await this.fileRepository.find({ select: ['fileUse'] })
    return [...new Set(data.map((item) => item.fileUse))]
  }

  /**
   * 文件上传
   * @param file 文件
   * @param config 配置
   */
  async upload(file: Express.Multer.File, config: UploadConfigDto): Promise<UploadFileVo> {
    const fileConfig = config
    const localConfig = this.configService.get<Record<string, string>>('upload.file')

    const fileName = fileConfig.name || FileUtils.randomName(file.originalname)
    const filePath = path.join(fileConfig.path || '', fileName)
    const localPath = path.join(localConfig.path || '', filePath)
    const domainPath = path.join(localConfig.domain || '', localConfig.prefix, filePath)

    fs.mkdirSync(path.dirname(localPath), { recursive: true })
    const readStream = Readable.from(file.buffer)
    const writeStream = fs.createWriteStream(localPath)
    await pipeline(readStream, writeStream)

    return {
      fileUrl: domainPath,
      fileName: path.basename(fileName),
      fileSize: file.size,
      fileType: file.mimetype,
      fileOriginalName: Buffer.from(file.originalname, 'latin1').toString('utf-8'),
    }
  }
}
