import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

/**
 * 分页基础参数
 */
export class PaginateDto {
  /**
   * 当前页数
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  readonly page: number = 1

  /**
   * 当前页数量
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  readonly limit: number = 10
}
