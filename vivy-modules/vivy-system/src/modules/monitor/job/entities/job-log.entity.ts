import { BaseTimeEntity, BaseStatusEnums } from '@vivy-common/core'
import { IsEnum, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * 定时任务日志表
 */
@Entity({ name: 'job_log' })
export class JobLog extends BaseTimeEntity {
  @PrimaryGeneratedColumn({
    name: 'job_log_id',
    type: 'bigint',
    comment: '任务日志ID',
  })
  @IsInt()
  @IsNotEmpty()
  jobLogId: number

  @Column({
    name: 'job_id',
    type: 'bigint',
    comment: '任务ID',
  })
  @IsInt()
  @IsNotEmpty()
  jobId: number

  @Column({
    name: 'job_name',
    type: 'varchar',
    length: 100,
    comment: '任务名称',
  })
  @MaxLength(100)
  @IsNotEmpty()
  jobName: string

  @Column({
    name: 'job_group',
    type: 'varchar',
    length: 100,
    comment: '任务组名',
  })
  @MaxLength(100)
  @IsNotEmpty()
  jobGroup: string

  @Column({
    name: 'invoke_target',
    type: 'varchar',
    length: 500,
    comment: '调用目标',
  })
  @MaxLength(100)
  @IsNotEmpty()
  invokeTarget: string

  @Column({
    name: 'invoke_params',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '调用参数',
  })
  @MaxLength(500)
  @IsNotEmpty()
  invokeParams?: string

  @Column({
    name: 'invoke_message',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '调用信息',
  })
  @MaxLength(500)
  @IsOptional()
  invokeMessage?: string

  @Column({
    name: 'exception_message',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '异常信息',
  })
  @MaxLength(500)
  @IsOptional()
  exceptionMessage?: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '状态（0成功 1失败）',
  })
  @IsEnum(BaseStatusEnums)
  @IsOptional()
  status: string
}
