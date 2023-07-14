import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type { SysOperLog, ListOperLogDto } from '@/apis/types/system/oper-log';

/**
 * 查询操作日志列表
 */
export function listOperLog(params: Partial<ListOperLogDto>) {
  return request<Pagination<SysOperLog>>('/system/oper/log/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 清空操作日志
 */
export function clearOperLog() {
  return request('/system/oper/log/clear', {
    method: RequestEnum.DELETE,
  });
}
