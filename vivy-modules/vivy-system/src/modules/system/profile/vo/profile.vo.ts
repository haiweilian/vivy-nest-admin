import { SysDept } from '@/modules/system/dept/entities/sys-dept.entity'
import { SysPost } from '@/modules/system/post/entities/sys-post.entity'
import { SysRole } from '@/modules/system/role/entities/sys-role.entity'
import { SysUser } from '@/modules/system/user/entities/sys-user.entity'

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
