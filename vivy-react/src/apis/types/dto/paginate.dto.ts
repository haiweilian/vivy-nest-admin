// import { Type } from 'class-transformer'
// import { IsInt, Min } from 'class-validator'

/**
 * 分页基础参数
 */
export interface PaginateDto {
  /**
   * 当前页数
   */
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  readonly page?: number;

  /**
   * 当前页数量
   */
  // @Type(() => Number)
  // @IsInt()
  // @Min(1)
  readonly limit?: number;
}
