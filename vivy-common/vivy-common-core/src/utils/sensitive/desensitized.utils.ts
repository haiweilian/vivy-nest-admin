/**
 * 脱敏工具类
 */
export class DesensitizedUtils {
  /**
   * 姓名，第2位星号替换
   */
  static userName(s: string) {
    return s.replace(/(\S)\S(\S*)/g, '$1*$2')
  }

  /**
   * 密码，全部字符都用*代替
   */
  static password(s: string) {
    return s.replace(/\S/g, '*')
  }

  /**
   * 手机号，中间4位星号替换
   */
  static phone(s: string) {
    return s.replace(/(\d{3})\d{4}(\d{4})/g, '$1****$2')
  }

  /**
   * 电子邮箱，仅显示第一个字母和@后面的地址显示，其他星号替换
   */
  static email(s: string) {
    return s.replace(/(^.)[^@]*(@.*$)/g, '$1****$2')
  }

  /**
   * 身份证，中间10位星号替换
   */
  static idCard(s: string) {
    return s.replace(/(\d{4})\d{10}(\d{4})/, '$1** ****** **$2')
  }

  /**
   * 银行卡号，保留最后4位，其他星号替换
   */
  static bankCard(s: string) {
    return s.replace(/\d+(\d{4})/, '**** **** **** **** $1')
  }
}
