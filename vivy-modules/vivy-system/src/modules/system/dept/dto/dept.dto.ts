import { OmitType } from '@nestjs/mapped-types'
import { SysDept } from '../entities/sys-dept.entity'

/**
 * 添加部门
 */
export class CreateDeptDto extends OmitType(SysDept, ['deptId'] as const) {}

/**
 * 更新部门
 */
export class UpdateDeptDto extends OmitType(SysDept, [] as const) {}
