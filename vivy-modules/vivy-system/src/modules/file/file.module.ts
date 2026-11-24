import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@vivy-common/config'

import { SysFile } from './file/entities/sys-file.entity.js'
import { FileController } from './file/file.controller.js'
import { FileService } from './file/file.service.js'
import { UploadOptions } from './upload/upload.config.js'
import { multerDiskStorage } from './upload/upload.storage.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([SysFile]),
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        // storage: multerOssStorage(config.get<UploadOssOptions>('uploadOss')),
        storage: multerDiskStorage(config.get<UploadOptions>('upload')),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
