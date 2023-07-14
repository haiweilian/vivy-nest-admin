// import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'interface-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateDto } from '@/apis/types/dto';

/**
 * 列表
 */
export interface ListPostDto extends PaginateDto {
  /** 岗位名称 */
  // @Allow()
  // @ApiPropertyOptional()
  postName: string;

  /** 岗位编码 */
  // @Allow()
  // @ApiPropertyOptional()
  postCode: string;

  /** 岗位状态（0正常 1停用） */
  // @Allow()
  // @ApiPropertyOptional()
  status: string;
}

/**
 * 新增
 */
export interface CreatePostDto {
  /** 岗位名称 */
  // @IsNotEmpty()
  // @MaxLength(50)
  postName: string;

  /** 岗位编码 */
  // @IsNotEmpty()
  // @MaxLength(50)
  postCode: string;

  /** 显示顺序 */
  // @IsOptional()
  // @IsInt()
  postSort: number;

  /** 岗位状态（0正常 1停用） */
  // @IsOptional()
  // @MaxLength(1)
  status: string;

  /** 备注 */
  // @IsOptional()
  // @MaxLength(500)
  remark: string;
}

/**
 * 更新
 */
export interface UpdatePostDto extends CreatePostDto {
  /** 备注 */
  // @IsNotEmpty()
  // @IsInt()
  postId: number;
}
