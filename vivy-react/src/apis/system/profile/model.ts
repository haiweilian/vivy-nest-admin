import { DeptModel } from '../dept/model'
import { PostModel } from '../post/model'
import { RoleModel } from '../role/model'
import { UserModel } from '../user/model'

/**
 * 个人信息
 */
export interface ProfileInfoResult extends UserModel {
  /** 部门信息 */
  dept?: DeptModel

  /** 角色信息 */
  roles?: RoleModel[]

  /** 岗位信息 */
  posts?: PostModel[]
}

/**
 * 更新个人信息
 */
export type UpdateProfileParams = Pick<UserModel, 'nickName' | 'sex' | 'email' | 'phonenumber'>

/**
 * 更新个人密码
 */
export interface UpdatePasswordParams {
  /** 旧密码 */
  oldPassword: string

  /** 新密码 */
  newPassword: string
}

/**
 * 更新个人头像
 */
export interface UpdateAvatarParams {
  /** 用户头像 */
  avatar: string
}
