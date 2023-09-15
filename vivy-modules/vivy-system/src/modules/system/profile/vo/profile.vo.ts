import { SysDept } from '@/modules/system/dept/entities/sys-dept.entity'
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
}
