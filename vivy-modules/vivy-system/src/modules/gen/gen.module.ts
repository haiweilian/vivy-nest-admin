import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GenTableColumn } from './gen/entities/gen-table-column.entity'
import { GenTable } from './gen/entities/gen-table.entity'
import { GenController } from './gen/gen.controller'
import { GenMapper } from './gen/gen.mapper'
import { GenService } from './gen/gen.service'

@Module({
  imports: [TypeOrmModule.forFeature([GenTable, GenTableColumn])],
  controllers: [GenController],
  providers: [GenMapper, GenService],
})
export class GenModule {}
