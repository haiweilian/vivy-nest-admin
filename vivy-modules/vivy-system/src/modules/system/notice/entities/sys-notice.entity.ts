import { BaseStatusEnums, BaseBusinessEntity } from '@vivy-common/core'
import { IsEnum, IsIn, IsInt, IsNotEmpty, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 通知公告表
 */
@Entity({ name: 'sys_notice' })
export class SysNotice extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'notice_id',
    type: 'bigint',
    comment: '公告ID',
  })
  @IsInt()
  @IsNotEmpty()
  noticeId: number

  @Column({
    name: 'notice_title',
    type: 'varchar',
    length: 50,
    comment: '公告标题',
  })
  @MaxLength(50)
  @IsNotEmpty()
  noticeTitle: string

  @Column({
    name: 'notice_type',
    type: 'char',
    length: 2,
    comment: '公告类型（1通知 2公告）',
  })
  @IsIn(['1', '2'])
  @IsNotEmpty()
  noticeType: string

  @Column({
    name: 'notice_content',
    type: 'longblob',
    comment: '公告内容',
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Buffer.from(value).toString()
      },
    },
  })
  @IsNotEmpty()
  noticeContent: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    comment: '公告状态（0正常 1关闭）',
  })
  @IsEnum(BaseStatusEnums)
  @IsNotEmpty()
  status: string
}
