import { BaseBusinessEntity } from '@vivy-common/core'
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 文件表
 */
@Entity({ name: 'sys_file' })
export class SysFile extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
    name: 'file_id',
    type: 'bigint',
    comment: '文件ID',
  })
  @IsInt()
  @IsNotEmpty()
  fileId: number

  @Column({
    name: 'file_use',
    type: 'varchar',
    length: 100,
    comment: '文件用途',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fileUse: string

  @Column({
    name: 'file_url',
    type: 'varchar',
    length: 500,
    comment: '文件路径',
  })
  @MaxLength(500)
  @IsNotEmpty()
  fileUrl: string

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 500,
    comment: '文件名称',
  })
  @MaxLength(500)
  @IsNotEmpty()
  fileName: string

  @Column({
    name: 'file_size',
    type: 'bigint',
    comment: '文件大小',
  })
  @IsInt()
  @IsNotEmpty()
  fileSize: number

  @Column({
    name: 'file_type',
    type: 'varchar',
    length: 100,
    comment: '文件类型',
  })
  @MaxLength(100)
  @IsNotEmpty()
  fileType: string
}
