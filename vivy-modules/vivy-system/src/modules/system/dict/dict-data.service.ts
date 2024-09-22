import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { In, Like, Repository } from 'typeorm'
import { DictCacheService } from './dict-cache.service'
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
    private dictDataRepository: Repository<SysDictData>,

    private dictCacheService: DictCacheService
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
          dictLabel: isNotEmpty(dictData.dictLabel) ? Like(`%${dictData.dictLabel}%`) : undefined,
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
    await this.dictCacheService.set(dictData.dictType)
  }

  /**
   * 更新字典数据
   * @param dictId 字典数据ID
   * @param dictData 字典数据信息
   */
  async update(dictId: number, dictData: UpdateDictDataDto): Promise<void> {
    await this.dictDataRepository.update(dictId, dictData)
    await this.dictCacheService.set(dictData.dictType)
  }

  /**
   * 删除字典数据
   * @param dictIds 字典数据ID
   */
  async delete(dictIds: number[]): Promise<void> {
    for (const dictId of dictIds) {
      const { dictType } = await this.dictDataRepository.findOneBy({ dictId })
      await this.dictDataRepository.delete(dictId)
      await this.dictCacheService.set(dictType)
    }
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
   * @param dictType 字典类型
   * @param dictLabel 字典数据标签
   * @param dictId 字典数据ID
   * @returns true 唯一 / false 不唯一
   */
  async checkDictLabelUnique(dictType: string, dictLabel: string, dictId?: number): Promise<boolean> {
    const info = await this.dictDataRepository.findOneBy({ dictType, dictLabel })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * 校验字典键值是否唯一
   * @param dictType 字典类型
   * @param dictValue 字典数据键值
   * @param dictId 字典数据ID
   * @returns true 唯一 / false 不唯一
   */
  async checkDictValueUnique(dictType: string, dictValue: string, dictId?: number): Promise<boolean> {
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
  async options(dictType: string): Promise<SysDictData[]> {
    const datas = await this.dictCacheService.get(dictType)
    return datas || []
  }

  /**
   * 根据字典类型查询字典对象集合
   * @param dictTypes 字典类型
   * @returns 字典数据选项对象
   */
  async selectDictLabelValue(dictTypes: string[]) {
    const data = await this.dictDataRepository.find({
      where: {
        dictType: In(dictTypes),
      },
    })

    const map: Record<string, { label: string; value: string }[]> = {}
    data.forEach((d) => {
      map[d.dictType] ??= []
      map[d.dictType].push({ label: d.dictLabel, value: d.dictValue })
    })
    return map
  }
}
