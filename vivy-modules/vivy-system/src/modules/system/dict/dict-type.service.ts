import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { BaseStatusEnums, ServiceException } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { DataSource, Like, Repository } from 'typeorm'
import { ListDictTypeDto, CreateDictTypeDto, UpdateDictTypeDto } from './dto/dict-type.dto'
import { SysDictData } from './entities/sys-dict-data.entity'
import { SysDictType } from './entities/sys-dict-type.entity'

/**
 * 字典类型管理
 * @author vivy
 */
@Injectable()
export class DictTypeService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(SysDictType)
    private dictTypeRepository: Repository<SysDictType>,

    @InjectRepository(SysDictData)
    private dictDataRepository: Repository<SysDictData>
  ) {}

  /**
   * 查询字典类型列表
   * @param dictType 字典类型信息
   * @returns 字典类型列表
   */
  async list(dictType: ListDictTypeDto): Promise<Pagination<SysDictType>> {
    return paginate<SysDictType>(
      this.dictTypeRepository,
      {
        page: dictType.page,
        limit: dictType.limit,
      },
      {
        order: {
          dictSort: 'ASC',
        },
        where: {
          status: dictType.status,
          dictName: isNotEmpty(dictType.dictName) ? Like(`%${dictType.dictName}%`) : undefined,
          dictType: isNotEmpty(dictType.dictType) ? Like(`%${dictType.dictType}%`) : undefined,
        },
      }
    )
  }

  /**
   * 添加字典类型
   * @param dictType 字典类型信息
   */
  async add(dictType: CreateDictTypeDto): Promise<void> {
    await this.dictTypeRepository.insert(dictType)
  }

  /**
   * 更新字典类型
   * @param dictId 字典类型ID
   * @param dictType 字典类型信息
   */
  async update(dictId: number, dictType: UpdateDictTypeDto): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const oldDict = await manager.findOneBy(SysDictType, { dictId })
      await manager.update(SysDictType, dictId, dictType)
      if (oldDict.dictType !== dictType.dictType) {
        await manager.update(SysDictData, { dictType: oldDict.dictType }, { dictType: dictType.dictType })
      }
    })
  }

  /**
   * 删除字典类型
   * @param dictIds 字典类型ID
   */
  async delete(dictIds: number[]): Promise<void> {
    for (const dictId of dictIds) {
      const { dictType, dictName } = await this.dictTypeRepository.findOneBy({ dictId })
      const count = await this.dictDataRepository.countBy({ dictType })
      if (count > 0) {
        throw new ServiceException(`${dictName}已分配,不能删除`)
      }
    }

    await this.dictTypeRepository.delete(dictIds)
  }

  /**
   * 字典类型详情
   * @param dictId 字典类型ID
   * @returns 字典类型详情
   */
  async info(dictId: number): Promise<SysDictType> {
    return this.dictTypeRepository.findOneBy({ dictId })
  }

  /**
   * 校验字典类型是否唯一
   * @param dictType 字典类型
   * @param dictId 字典类型ID
   * @returns true 唯一 / false 不唯一
   */
  async checkDictTypeUnique(dictType: string, dictId?: number): Promise<boolean> {
    const info = await this.dictTypeRepository.findOneBy({ dictType })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * 校验字典名称是否唯一
   * @param dictType 字典类型
   * @param dictId 字典类型ID
   * @returns true 唯一 / false 不唯一
   */
  async checkDictNameUnique(dictName: string, dictId?: number): Promise<boolean> {
    const info = await this.dictTypeRepository.findOneBy({ dictName })
    if (info && info.dictId !== dictId) {
      return false
    }

    return true
  }

  /**
   * 字典类型选项列表
   * @returns 字典类型选项列表
   */
  async options(): Promise<SysDictType[]> {
    return this.dictTypeRepository.find({
      select: ['dictId', 'dictName', 'dictType'],
      order: {
        dictSort: 'ASC',
      },
      where: {
        status: BaseStatusEnums.NORMAL,
      },
    })
  }
}
