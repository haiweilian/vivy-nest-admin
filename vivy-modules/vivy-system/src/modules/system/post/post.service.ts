import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ServiceException, BaseStatusEnums } from '@vivy-common/core'
import { isNotEmpty } from 'class-validator'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { Like, Repository } from 'typeorm'
import { SysUserPost } from '@/modules/system/user/entities/sys-user-post.entity'
import { ListPostDto, CreatePostDto, UpdatePostDto } from './dto/post.dto'
import { SysPost } from './entities/sys-post.entity'

/**
 * 岗位管理
 * @author vivy
 */
@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private postRepository: Repository<SysPost>,

    @InjectRepository(SysUserPost)
    private userPostRepository: Repository<SysUserPost>
  ) {}

  /**
   * 岗位列表
   * @param post 岗位信息
   * @returns 岗位列表
   */
  async list(post: ListPostDto): Promise<Pagination<SysPost>> {
    return paginate<SysPost>(
      this.postRepository,
      {
        page: post.page,
        limit: post.limit,
      },
      {
        order: {
          postSort: 'ASC',
        },
        where: {
          status: post.status,
          postName: isNotEmpty(post.postName) ? Like(`%${post.postName}%`) : undefined,
          postCode: isNotEmpty(post.postCode) ? Like(`%${post.postCode}%`) : undefined,
        },
      }
    )
  }

  /**
   * 添加岗位
   * @param post 岗位信息
   */
  async add(post: CreatePostDto): Promise<void> {
    await this.postRepository.insert(post)
  }

  /**
   * 更新岗位
   * @param post 岗位信息
   */
  async update(post: UpdatePostDto): Promise<void> {
    await this.postRepository.update(post.postId, post)
  }

  /**
   * 删除岗位
   * @param postIds 岗位ID
   */
  async delete(postIds: number[]): Promise<void> {
    for (const postId of postIds) {
      const count = await this.userPostRepository.countBy({ postId })
      if (count > 0) {
        const post = await this.postRepository.findOneBy({ postId })
        throw new ServiceException(`${post.postName}已分配,不能删除`)
      }
    }

    await this.postRepository.delete(postIds)
  }

  /**
   * 岗位详情
   * @param postId 岗位ID
   * @returns 岗位详情
   */
  async info(postId: number): Promise<SysPost> {
    return this.postRepository.findOneBy({ postId })
  }

  /**
   * 校验岗位名称是否唯一
   * @param post 岗位信息
   * @returns true 唯一 / false 不唯一
   */
  async checkPostNameUnique(post: Partial<SysPost>): Promise<boolean> {
    const { postId, postName } = post

    const info = await this.postRepository.findOneBy({ postName })
    if (info && info.postId !== postId) {
      return false
    }

    return true
  }

  /**
   * 校验岗位编码是否唯一
   * @param post 岗位信息
   * @returns true 唯一 / false 不唯一
   */
  async checkPostCodeUnique(post: Partial<SysPost>): Promise<boolean> {
    const { postId, postCode } = post

    const info = await this.postRepository.findOneBy({ postCode })
    if (info && info.postId !== postId) {
      return false
    }

    return true
  }

  /**
   * 岗位选项列表
   * @returns 岗位选项列表
   */
  async selectablePost(): Promise<SysPost[]> {
    return this.postRepository.find({
      select: ['postId', 'postName', 'postCode'],
      order: {
        postSort: 'ASC',
      },
      where: {
        status: BaseStatusEnums.NORMAL,
      },
    })
  }
}
