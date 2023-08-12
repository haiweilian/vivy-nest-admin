import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { ListDictDataDto, CreateDictDataDto, UpdateDictDataDto } from './dto/dict-data.dto'
import { SysDictData } from './entities/sys-dict-data.entity'

/**
 * 字典数据管理
 * @author vivy
 */
@Injectable()
export class DictDataService {
  constructor(
    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>
  ) {}

  /**
   * 查询字典数据列表
   * @author vivy
   * @param dictData 字典数据信息
   * @returns 字典数据列表
   */
  async list(dictData: ListDictDataDto): Promise<Pagination<SysDictData>> {
    return paginate<SysDictData>(
      this.dictDataRepository,
      {
        page: dictData.page,
        limit: dictData.limit,
      },
      {
        order: {
          dictSort: 'ASC',
        },
        where: {
          status: dictData.status,
          dictType: dictData.dictType,
          dictLabel: Like(`%${dictData.dictLabel}%`),
        },
      }
    )
  }

  /**
   * 添加字典数据
   * @param dictData 字典数据信息
   */
  async add(dictData: CreateDictDataDto): Promise<void> {
    await this.dictDataRepository.insert(dictData)
  }

  /**
   * 更新字典数据
   * @param dictData 字典数据信息
   */
  async update(dictData: UpdateDictDataDto): Promise<void> {
    await this.dictDataRepository.update(dictData.dictId, dictData)
  }

  /**
   * 删除字典数据
   * @param dictIds 字典数据ID
   */
  async delete(dictIds: number[]): Promise<void> {
    await this.dictDataRepository.delete(dictIds)
  }

  /**
   * 字典数据详情
   * @param dictId 字典数据ID
   * @returns 字典数据详情
   */
  async info(dictId: number): Promise<SysDictData> {
    return this.dictDataRepository.findOneBy({ dictId })
  }

  /**
   * 校验字典标签是否唯一
   * @param dictData 字典数据信息
   * @returns true 唯一 / false 不唯一
   */
  async checkDictLabelUnique(dictData: Partial<SysDictData>): Promise<boolean> {
    const { dictId, dictType, dictLabel } = dictData

    const info = await this.dictDataRepository.findOneBy({ dictType, dictLabel })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * 校验字典键值是否唯一
   * @param dictData 字典数据信息
   * @returns true 唯一 / false 不唯一
   */
  async checkDictValueUnique(dictData: Partial<SysDictData>): Promise<boolean> {
    const { dictId, dictType, dictValue } = dictData

    const info = await this.dictDataRepository.findOneBy({ dictType, dictValue })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * 根据字典类型查询字典数据选项列表
   * @param dictType 字典类型
   * @returns 字典数据选项列表
   */
  async listByDictType(dictType: string): Promise<SysDictData[]> {
    return this.dictDataRepository.find({
      where: {
        dictType,
      },
    })
  }
}
