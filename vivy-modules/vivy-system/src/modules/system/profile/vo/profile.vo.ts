import { SysDept } from '@/modules/system/dept/entities/sys-dept.entity.js'
import { SysPost } from '@/modules/system/post/entities/sys-post.entity.js'
import { SysRole } from '@/modules/system/role/entities/sys-role.entity.js'
import { SysUser } from '@/modules/system/user/entities/sys-user.entity.js'

/**
 * 个人信息
 */
export class ProfileInfoVo extends SysUser {
  /** 部门信息 */
  dept?: SysDept

  /** 角色信息 */
  roles?: SysRole[]

  /** 岗位信息 */
  posts?: SysPost[]
}
