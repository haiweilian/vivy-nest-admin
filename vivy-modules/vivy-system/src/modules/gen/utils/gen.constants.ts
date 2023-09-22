/**
 * 代码生成通用常量
 * @author vivy
 */
export class GenConstants {
  /** 所有者 */
  static AUTHOR = 'vivy'

  /** 模块名 */
  static MODULE = 'system'

  /** 数据库字符串类型 */
  static COLUMNTYPE_STR = ['char', 'varchar', 'nvarchar', 'varchar2']

  /** 数据库文本类型 */
  static COLUMNTYPE_TEXT = ['tinytext', 'text', 'mediumtext', 'longtext']

  /** 数据库时间类型 */
  static COLUMNTYPE_TIME = ['datetime', 'time', 'date', 'timestamp']

  /** 数据库数字类型 */
  static COLUMNTYPE_NUMBER = [
    'tinyint',
    'smallint',
    'mediumint',
    'int',
    'number',
    'integer',
    'bigint',
    'float',
    'double',
    'decimal',
  ]

  /** 页面不需要编辑字段 */
  static COLUMNNAME_NOT_EDIT = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** 页面不需要显示的列表字段 */
  static COLUMNNAME_NOT_LIST = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** 页面不需要查询字段 */
  static COLUMNNAME_NOT_QUERY = ['id', 'create_by', 'create_time', 'update_by', 'update_time']

  /** Entity 基类字段 */
  static BASE_ENTITY = ['createBy', 'createTime', 'updateBy', 'updateTime']

  /** 文本框 */
  static HTML_INPUT = 'input'

  /** 数字框 */
  static HTML_NUMBER = 'number'

  /** 文本域 */
  static HTML_TEXTAREA = 'textarea'

  /** 下拉框 */
  static HTML_SELECT = 'select'

  /** 单选框 */
  static HTML_RADIO = 'radio'

  /** 复选框 */
  static HTML_CHECKBOX = 'checkbox'

  /** 日期控件 */
  static HTML_DATETIME = 'datetime'

  /** 上传控件 */
  static HTML_UPLOAD = 'upload'

  /** 富文本控件 */
  static HTML_EDITOR = 'editor'

  /** TS 字符串类型 */
  static TS_TYPE_STRING = 'string'

  /** TS 数字类型 */
  static TS_TYPE_NUMBER = 'number'

  /** TS 未知类型 */
  static TS_TYPE_UNKNOWN = 'unknown'

  /** JAVA 字符串类型 */
  static JAVA_TYPE_STRING = 'String'

  /** JAVA 整型 */
  static JAVA_TYPE_INTEGER = 'Integer'

  /** JAVA 长整型 */
  static JAVA_TYPE_LONG = 'Long'

  /** JAVA 浮点型 */
  static JAVA_TYPE_DOUBLE = 'Double'

  /** JAVA 高精度计算类型 */
  static JAVA_TYPE_BIGDECIMAL = 'BigDecimal'

  /** JAVA 时间类型 */
  static JAVA_TYPE_DATE = 'Date'

  /** 模糊查询 */
  static QUERY_LIKE = 'LIKE'

  /** 相等查询 */
  static QUERY_EQ = 'EQ'

  /** 需要 */
  static REQUIRE = '0'
}
