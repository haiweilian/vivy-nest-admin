import { IP2Region } from 'ip2region/node'
import { getClientIp, Request } from 'request-ip'

/**
 * IP 归属地信息
 */
export interface Ip2RegionResult {
  country: string
  province: string
  city: string
  area: string
  isp: string
}

const EMPTY_RESULT: Ip2RegionResult = {
  country: '',
  province: '',
  city: '',
  area: '',
  isp: '',
}

/**
 * 获取 IP 方法
 */
export class IpUtils {
  private static instance: IP2Region | null = null

  /**
   * 获取用户请求 IP 地址
   */
  static requestIp = (req: Request) => getClientIp(req)

  /**
   * 懒加载查询实例，只加载 IPv4 数据（约 11MB，同时加载 IPv6 会再多 37MB）
   */
  private static getInstance(): IP2Region {
    if (!this.instance) {
      this.instance = new IP2Region({ families: [4] as const })
    }
    return this.instance
  }

  /**
   * 获取 Ip 地理位置信息
   */
  static ip2Region = (ip: string): Ip2RegionResult => {
    if (!ip) return EMPTY_RESULT

    try {
      const result = this.getInstance().lookup(ip)
      if (!result) return EMPTY_RESULT

      return {
        country: result.country?.name ?? '',
        province: result.subdivisions?.[0]?.name ?? '',
        city: result.city?.name ?? '',
        area: result.subdivisions
          ?.slice(1)
          .map((item) => item.name)
          .filter(Boolean)
          .join(' '),
        isp: result.isp ?? '',
      }
    } catch {
      return EMPTY_RESULT
    }
  }
}
