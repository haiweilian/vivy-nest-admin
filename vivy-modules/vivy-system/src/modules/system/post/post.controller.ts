import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AjaxResult, SecurityContext } from '@vivy-common/core'
import { Log, OperType } from '@vivy-common/logger'
import { RequirePermissions } from '@vivy-common/security'
import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'
import { PostService } from './post.service'

/**
 * 岗位管理
 * @author vivy
 */
@ApiTags('岗位管理')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private securityContext: SecurityContext
  ) {}

  /**
   * 岗位列表
   * @param post 岗位信息
   * @returns 岗位列表
   */
  @Get()
  @RequirePermissions('system:post:list')
  async list(@Query() post: ListPostDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.list(post))
  }

  /**
   * 添加岗位
   * @param post 岗位信息
   */
  @Post()
  @Log({ title: '岗位管理', operType: OperType.INSERT })
  @RequirePermissions('system:post:add')
  async add(@Body() post: CreatePostDto): Promise<AjaxResult> {
    if (!(await this.postService.checkPostNameUnique(post.postName))) {
      return AjaxResult.error(`新增岗位${post.postName}失败，岗位名称已存在`)
    }

    if (!(await this.postService.checkPostCodeUnique(post.postCode))) {
      return AjaxResult.error(`新增岗位${post.postName}失败，岗位编码已存在`)
    }

    post.createBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.postService.add(post))
  }

  /**
   * 更新岗位
   * @param postId 岗位ID
   * @param post 岗位信息
   */
  @Put(':postId')
  @Log({ title: '岗位管理', operType: OperType.UPDATE })
  @RequirePermissions('system:post:update')
  async update(@Param('postId') postId: number, @Body() post: UpdatePostDto): Promise<AjaxResult> {
    if (!(await this.postService.checkPostNameUnique(post.postName, postId))) {
      return AjaxResult.error(`修改岗位${post.postName}失败，岗位名称已存在`)
    }

    if (!(await this.postService.checkPostCodeUnique(post.postCode, postId))) {
      return AjaxResult.error(`修改岗位${post.postName}失败，岗位编码已存在`)
    }

    post.updateBy = this.securityContext.getUserName()
    return AjaxResult.success(await this.postService.update(postId, post))
  }

  /**
   * 删除岗位
   * @param postIds 岗位ID
   */
  @Delete(':postIds')
  @Log({ title: '岗位管理', operType: OperType.DELETE })
  @RequirePermissions('system:post:delete')
  async delete(@Param('postIds', new ParseArrayPipe({ items: Number })) postIds: number[]): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.delete(postIds))
  }

  /**
   * 岗位选项列表
   * @returns 岗位选项列表
   */
  @Get('options')
  async options(): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.options())
  }

  /**
   * 岗位详情
   * @param postId 岗位ID
   * @returns 岗位详情
   */
  @Get(':postId')
  @RequirePermissions('system:post:query')
  async info(@Param('postId') postId: number): Promise<AjaxResult> {
    return AjaxResult.success(await this.postService.info(postId))
  }
}
