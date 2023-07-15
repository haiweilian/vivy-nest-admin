import { BaseTimeEntity } from '@vivy-common/core'
import { Column, Entity } from 'typeorm'

/**
 * 用户和角色关联表 用户1-N角色
 */
@Entity({ name: 'sys_user_role' })
export class SysUserRole extends BaseTimeEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    primary: true,
    comment: '用户ID',
  })
  userId: number

  @Column({
    name: 'role_id',
    type: 'int',
    primary: true,
    comment: '角色ID',
  })
  roleId: number
}
