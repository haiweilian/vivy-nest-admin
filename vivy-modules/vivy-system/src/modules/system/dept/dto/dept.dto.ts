import { OmitType } from '@nestjs/mapped-types'
import { SysDept } from '../entities/sys-dept.entity'

/**
 * 新增
 */
export class CreateDeptDto extends OmitType(SysDept, ['deptId'] as const) {}

/**
 * 更新
 */
export class UpdateDeptDto extends SysDept {}
