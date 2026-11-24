import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GenTableColumn } from './gen/entities/gen-table-column.entity.js'
import { GenTable } from './gen/entities/gen-table.entity.js'
import { GenController } from './gen/gen.controller.js'
import { GenMapper } from './gen/gen.mapper.js'
import { GenService } from './gen/gen.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([GenTable, GenTableColumn])],
  controllers: [GenController],
  providers: [GenMapper, GenService],
})
export class GenModule {}
