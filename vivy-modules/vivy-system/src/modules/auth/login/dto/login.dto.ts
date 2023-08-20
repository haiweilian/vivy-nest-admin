import { ApiProperty } from '@nestjs/swagger'
import { Allow } from 'class-validator'

export class LoginDto {
  /**
   * 用户名
   */
  @Allow()
  @ApiProperty({
    name: '用户名',
    default: 'admin',
  })
  username: string

  /**
   * 用户密码
   */
  @Allow()
  @ApiProperty({
    name: '用户密码',
    default: 'Aa@123456',
  })
  password: string
}
