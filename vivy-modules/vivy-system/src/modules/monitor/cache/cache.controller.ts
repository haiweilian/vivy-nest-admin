import { Controller, Delete, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { CacheService } from './cache.service'

/**
 * 缓存管理
 * @author vivy
 */
@ApiTags('缓存列表')
@ApiBearerAuth()
@Controller('caches')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  /**
   * 查询缓存名称列表
   */
  @Get()
  @RequirePermissions('monitor:cache:query')
  async getAll(): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getAll())
  }

  /**
   * 查询缓存键名列表
   * @param name 缓存名称
   */
  @Get(':name/keys')
  @RequirePermissions('monitor:cache:query')
  async getKeys(@Param('name') name: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getKeys(name))
  }

  /**
   * 查询缓存内容
   * @param name 缓存名称
   * @param key 缓存键名
   */
  @Get(':name/keys/:key')
  @RequirePermissions('monitor:cache:query')
  async getValue(@Param('name') name: string, @Param('key') key: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.getValue(name, key))
  }

  /**
   * 删除全部缓存内容
   */
  @Delete()
  @Log({ title: '缓存列表', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteAll(): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteAll())
  }

  /**
   * 根据缓存名称删除缓存内容
   * @param name 缓存名称
   */
  @Delete(':name')
  @Log({ title: '缓存列表', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteByName(@Param('name') name: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteByName(name))
  }

  /**
   * 根据缓存键名删除缓存内容
   * @param name 缓存名称
   * @param key 缓存键名
   */
  @Delete(':name/keys/:key')
  @Log({ title: '缓存列表', operType: OperType.DELETE })
  @RequirePermissions('monitor:cache:delete')
  async deleteByNameAndKey(@Param('name') name: string, @Param('key') key: string): Promise<AjaxResult> {
    return AjaxResult.success(await this.cacheService.deleteByNameAndKey(name, key))
  }
}
