// import { Allow, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
// import { OperType, OperStatus } from '@vivy-cloud/common-logger'
import { PaginateDto } from '@/apis/types/dto';

/**
 * 列表
 */
export interface ListOperLogDto extends PaginateDto {
  /** 模块标题 */
  // @Allow()
  title: string;

  /** 操作类型(enum OperType) */
  // @Allow()
  operType: string;

  /** 操作人员 */
  // @Allow()
  operName: string;

  /** 操作状态(enum OperStatus) */
  // @Allow()
  operStatus: string;

  /** 请求地址 */
  // @Allow()
  requestUrl: string;

  /** 操作时间 */
  // @Allow()
  createTime: string;
}
