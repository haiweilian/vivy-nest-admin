import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysDictData } from '@/modules/system/dict-data/entities/sys-dict-data.entity'
import { DictTypeController } from './dict-type.controller'
import { DictTypeService } from './dict-type.service'
import { SysDictType } from './entities/sys-dict-type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SysDictType, SysDictData])],
  controllers: [DictTypeController],
  providers: [DictTypeService],
})
export class DictTypeModule {}
