// import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { LoginType, OperStatus } from '@vivy-cloud/common-logger'
import { PaginateDto } from '@/apis/types/dto';

/**
 * 列表
 */
export interface ListLoginLogDto extends PaginateDto {
  /** 用户账号 */
  // @Allow()
  loginName: string;

  /** 登录状态(enum OperStatus) */
  // @Allow()
  loginStatus: number;

  /** 登录时间 */
  // @Allow()
  createdTime: string;
}
