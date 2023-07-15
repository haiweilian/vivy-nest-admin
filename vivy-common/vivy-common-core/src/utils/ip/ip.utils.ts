import IP2Region from 'ip2region'
import { getClientIp, Request } from 'request-ip'

/**
 * 获取 IP 方法
 */
export class IpUtils {
  private static IP2RegionInstance = new IP2Region()

  /**
   * 获取用户请求 IP 地址
   */
  static requestIp = (req: Request) => getClientIp(req)

  /**
   * 获取 Ip 地理位置信息
   */
  static ip2Region = (ip: string) => this.IP2RegionInstance.search(ip)
}
