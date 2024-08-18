import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@vivy-common/config'

import { SysFile } from './file/entities/sys-file.entity'
import { FileController } from './file/file.controller'
import { FileService } from './file/file.service'
import { UploadOptions, UPLOAD_OPTIONS } from './upload/upload.config'
import { uploadStorage } from './upload/upload.storage'

@Module({
  imports: [
    TypeOrmModule.forFeature([SysFile]),
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        storage: uploadStorage(config.get<UploadOptions>('upload')),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: UPLOAD_OPTIONS,
      useFactory: (config: ConfigService) => {
        return config.get<UploadOptions>('upload')
      },
      inject: [ConfigService],
    },
  ],
  exports: [FileService],
})
export class FileModule {}
