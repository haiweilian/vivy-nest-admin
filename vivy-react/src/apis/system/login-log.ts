import { request } from '@umijs/max';
import { RequestEnum } from '@/enums/httpEnum';
import type { Pagination } from '@/apis/types/models';
import type { ListLoginLogVo, ListLoginLogDto } from '@/apis/types/system/login-log';

/**
 * 查询登录日志列表
 */
export function listLoginLog(params: Partial<ListLoginLogDto>) {
  return request<Pagination<ListLoginLogVo>>('/system/login/log/list', {
    method: RequestEnum.GET,
    params,
  });
}

/**
 * 清空登录日志
 */
export function clearLoginLog() {
  return request('/system/login/log/clear', {
    method: RequestEnum.DELETE,
  });
}
