import { SysLoginLog } from '../sys-login-log.entity';

/**
 * 登录日志列表
 */
export interface ListLoginLogVo extends SysLoginLog {
  /** 操作系统 */
  os: string;

  /** 浏览器信息 */
  browser: string;
}
