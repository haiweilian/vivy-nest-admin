import { randomUUID } from 'crypto'
import { extname } from 'path'

/**
 * 文件工具类
 * @author vivy
 */
export class FileUtils {
  /**
   * 生成随机名称
   * @param originalname 原始名称
   * @returns 随机名称
   */
  static randomName(originalname: string) {
    return Date.now() + randomUUID().replace(/-/g, '') + extname(originalname)
  }
}
