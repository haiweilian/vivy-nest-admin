import { IsEmail, IsIn, IsMobilePhone, IsNotEmpty, MaxLength } from 'class-validator'

/**
 * 更新个人信息
 */
export class UpdateProfileDto {
  /** 用户昵称 */
  @MaxLength(50)
  @IsNotEmpty()
  nickName: string

  /** 用户邮箱 */
  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string

  /** 手机号码 */
  @IsMobilePhone('zh-CN')
  @MaxLength(11)
  @IsNotEmpty()
  phonenumber: string

  /** 用户性别 */
  @IsIn(['0', '1', '2'])
  @IsNotEmpty()
  sex: string
}

/**
 * 更新个人密码
 */
export class UpdatePasswordDto {
  /** 旧密码 */
  @MaxLength(36)
  oldPassword: string

  /** 新密码 */
  @MaxLength(36)
  newPassword: string
}
