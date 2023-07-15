import * as bcrypt from 'bcrypt'

/**
 * 密码加密方法
 */
export class PasswordUtils {
  private static saltRounds = 10

  /**
   * 生成密码
   * @param password 密码
   * @returns 加密字符串
   */
  static async create(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  /**
   * 判断密码是否相同
   * @param rawPassword 真实密码
   * @param hashPassword 加密后字符
   * @returns 结果
   */
  static async compare(rawPassword: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashPassword)
  }
}
