import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListFileDto, CreateFileDto } from './dto/file.dto'
import { SysFile } from './entities/sys-file.entity'

/**
 * 文件管理
 * @author vivy
 */
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(SysFile)
    private fileRepository: Repository<SysFile>
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
  async add(file: CreateFileDto | CreateFileDto[]): Promise<void> {
    await this.fileRepository.insert(file)
  }

  /**
   * 文件用途选项
   * @returns 文件用途选项列表
   */
  async useOptions(): Promise<string[]> {
    const data = await this.fileRepository.find({ select: ['fileUse'] })
    return [...new Set(data.map((item) => item.fileUse))]
  }
}
