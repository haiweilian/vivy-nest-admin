import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// entities
import { GenTableColumn } from '@/entities/gen-table-column.entity'
import { GenTable } from '@/entities/gen-table.entity'

// modules
import { GenController } from './gen/gen.controller'
import { GenService } from './gen/gen.service'

@Module({
  imports: [TypeOrmModule.forFeature([GenTable, GenTableColumn])],
  controllers: [GenController],
  providers: [GenService],
})
export class GenModule {}
