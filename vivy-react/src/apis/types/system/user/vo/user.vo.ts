import { SysUser } from '../sys-user.entity';

/**
 * 用户详情
 */
export interface UserInfoVo extends SysUser {
  /** 用户角色 */
  roleIds: number[];

  /** 用户岗位 */
  postIds: number[];
}
