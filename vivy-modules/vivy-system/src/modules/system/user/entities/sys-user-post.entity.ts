import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * 用户与岗位关联表 用户1-N岗位
 */
@Entity({ name: 'sys_user_post' })
export class SysUserPost extends BaseTimeEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    primary: true,
    comment: '用户ID',
  })
  userId: number

  @Column({
    name: 'post_id',
    type: 'int',
    primary: true,
    comment: '岗位ID',
  })
  postId: number
}
