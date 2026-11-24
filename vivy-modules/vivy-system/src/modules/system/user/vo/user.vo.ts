import { SysUser } from '../entities/sys-user.entity.js'

/**
 * 用户详情
 */
export class UserInfoVo extends SysUser {
  /** 用户角色 */
  roleIds: number[]

  /** 用户岗位 */
  postIds: number[]
}
