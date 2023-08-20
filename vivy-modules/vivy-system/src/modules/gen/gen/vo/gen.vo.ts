/**
 * 生成预览
 */
export class GenPreviewVo {
  /** 分类名称 */
  name: string

  /** 文件列表 */
  files: Array<{
    /** 文件名称 */
    name: string

    /** 文件代码 */
    code: string
  }>
}
