import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'

export class LoginInfoDto {
  /**
   * 用户名
   */
  @Allow()
  @ApiProperty({
    default: 'admin',
  })
  username: string

  /**
   * 用户密码
   */
  @Allow()
  @ApiProperty({
    default: 'Aa@123456',
  })
  password: string
}
