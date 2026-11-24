import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SysUserPost } from '@/modules/system/user/entities/sys-user-post.entity.js'
import { SysPost } from './entities/sys-post.entity.js'
import { PostController } from './post.controller.js'
import { PostService } from './post.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([SysPost, SysUserPost])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
