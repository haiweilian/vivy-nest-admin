import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DictDataController } from './dict-data.controller'
import { DictDataService } from './dict-data.service'
import { SysDictData } from './entities/sys-dict-data.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SysDictData])],
  controllers: [DictDataController],
  providers: [DictDataService],
})
export class DictDataModule {}
