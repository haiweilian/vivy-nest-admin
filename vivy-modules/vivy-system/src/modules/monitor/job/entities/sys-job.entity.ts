import { BaseBusinessEntity, BaseStatusEnums } from '@vivy-common/core'
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import * as parser from 'cron-parser'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Cron 表达式验证，Bull 使用 cron-parser 解析
 */
@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class IsCronExpression implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    try {
      parser.parseExpression(value)
      return true
    } catch (e) {
      return false
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'this cron expression ($value) invalid'
  }
}

/**
 * 定时任务表
 */
@Entity({ name: 'sys_job' })
export class SysJob extends BaseBusinessEntity {
  @PrimaryGeneratedColumn({
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
  @IsOptional()
  invokeParams?: string

  @Column({
    name: 'cron_expression',
    type: 'varchar',
    length: 100,
    comment: 'Cron表达式',
  })
  @Validate(IsCronExpression)
  @MaxLength(100)
  @IsNotEmpty()
  cronExpression: string

  @Column({
    name: 'status',
    type: 'char',
    length: 1,
    default: '0',
    comment: '状态（0正常 1停用）',
  })
  @IsEnum(BaseStatusEnums)
  @IsOptional()
  status: string

  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '备注',
  })
  @MaxLength(500)
  @IsOptional()
  remark?: string
}
