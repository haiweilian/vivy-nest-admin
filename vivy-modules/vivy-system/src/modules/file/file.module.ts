import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysFile } from './file/entities/sys-file.entity'
import { FileController } from './file/file.controller'
import { FileService } from './file/file.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysFile])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
