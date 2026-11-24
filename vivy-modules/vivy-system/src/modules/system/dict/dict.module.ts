import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictCacheService } from './dict-cache.service.js'
import { DictDataController } from './dict-data.controller.js'
import { DictDataService } from './dict-data.service.js'
import { DictTypeController } from './dict-type.controller.js'
import { DictTypeService } from './dict-type.service.js'
import { SysDictData } from './entities/sys-dict-data.entity.js'
import { SysDictType } from './entities/sys-dict-type.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysDictType, SysDictData])],
  controllers: [DictTypeController, DictDataController],
  providers: [DictTypeService, DictDataService, DictCacheService],
})
export class DictModule {}
