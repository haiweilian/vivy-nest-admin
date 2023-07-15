import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginateDto } from '@vivy-common/core'
import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

/**
 * 列表
 */
export class ListPostDto extends PaginateDto {
  /** 岗位名称 */
  @Allow()
  @ApiPropertyOptional()
  postName: string = ''

  /** 岗位编码 */
  @Allow()
  @ApiPropertyOptional()
  postCode: string = ''

  /** 岗位状态（0正常 1停用） */
  @Allow()
  @ApiPropertyOptional()
  status: string
}

/**
 * 新增
 */
export class CreatePostDto {
  /** 岗位名称 */
  @IsNotEmpty()
  @MaxLength(50)
  postName: string

  /** 岗位编码 */
  @IsNotEmpty()
  @MaxLength(50)
  postCode: string

  /** 显示顺序 */
  @IsOptional()
  @IsInt()
  postSort: number

  /** 岗位状态（0正常 1停用） */
  @IsOptional()
  @MaxLength(1)
  status: string

  /** 备注 */
  @IsOptional()
  @MaxLength(500)
  remark: string
}

/**
 * 更新
 */
export class UpdatePostDto extends CreatePostDto {
  /** 备注 */
  @IsNotEmpty()
  @IsInt()
  postId: number
}
