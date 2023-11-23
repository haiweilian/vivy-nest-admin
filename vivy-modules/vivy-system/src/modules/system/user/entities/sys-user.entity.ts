import { BaseBusinessEntity, BaseStatusEnums } from '@vivy-common/core'
import { ExcelColumn, ExcelSheet } from '@vivy-common/excel'
import { IsEmail, IsEnum, IsIn, IsInt, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 用户信息表
 */
@Entity({ name: 'sys_user' })
@ExcelSheet({
  name: '用户信息',
  rowHeight: 30,
  colWidth: 30,
  colStyle: { alignment: { vertical: 'middle' } },
  headerStyle: {
    font: { color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' }, bgColor: { argb: '000000' } },
  },
})
export class SysUser extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'bigint',
    comment: '用户ID',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number

  @Column({
    name: 'dept_id',
    type: 'bigint',
    nullable: true,
    comment: '部门ID',
  })
  @IsInt()
  @IsOptional()
  deptId?: number

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户账号',
  })
  @ExcelColumn({
    name: '用户账号',
  })
  @MaxLength(50)
  @IsNotEmpty()
  userName: string

  @Column({
    name: 'nick_name',
    type: 'varchar',
    length: 50,
    comment: '用户昵称',
  })
  @ExcelColumn({
    name: '用户昵称',
  })
  @MaxLength(50)
  @IsNotEmpty()
  nickName: string

  @Column({
    name: 'user_type',
    type: 'char',
    length: 2,
    default: '00',
    comment: '用户类型（00系统用户）',
  })
  @IsOptional()
  userType: string

  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '用户邮箱',
  })
  @IsEmail()
  @MaxLength(50)
  @IsOptional()
  email?: string

  @Column({
    name: 'phonenumber',
    type: 'varchar',
    length: 11,
    nullable: true,
    comment: '手机号码',
  })
  @ExcelColumn({
    name: '用户手机',
    width: 30,
    cellConfig({ cell }) {
      if (typeof cell.value === 'string') {
        cell.value = cell.value.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
      }
    },
  })
  @IsMobilePhone('zh-CN')
  @MaxLength(11)
  @IsOptional()
  phonenumber?: string

  @Column({
    name: 'sex',
    type: 'char',
    length: 1,
    default: '2',
    comment: '用户性别（0男 1女 2未知）',
  })
  @ExcelColumn({
    name: '用户性别',
    dictType: 'sys_user_sex',
    dictOptions: [
      { label: '男', value: '0' },
      { label: '女', value: '1' },
      { label: '其他', value: '2' },
    ],
  })
  @IsIn(['0', '1', '2'])
  @IsOptional()
  sex: string

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '头像地址',
  })
  @ExcelColumn({
    name: '用户头像',
    type: 'image',
    imageOptions: {
      width: 30,
      height: 30,
      hyperlink: true,
    },
  })
  @MaxLength(255)
  @IsOptional()
  avatar?: string

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
    comment: '密码',
  })
  @MaxLength(36) // bcrypt max 72 bytes
  @IsNotEmpty()
  password: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '用户状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnums)
  @IsOptional()
  status: string

  @Column({
    name: 'del_flag',
    type: 'char',
    length: 1,
    default: '0',
    select: false,
    comment: '删除标志（0存在 1删除）',
  })
  delFlag: string
}
