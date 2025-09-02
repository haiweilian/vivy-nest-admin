import '@umijs/max/typings'

// 扩展 umi max 的请求类型
declare module '@umijs/max' {
  interface RequestOptions {
    /**
     * 是否需要 token，设置为 false 时不会在请求头中添加 Authorization
     * @default true
     */
    isToken?: boolean

    /**
     * 获取 axios 返回的原始数据 { data, config, headers }
     * @default false
     */
    getResponse?: boolean

    /**
     * 获取服务端返回的原始数据 { code, data, message }
     * @default false
     */
    getAjaxResponse?: boolean

    /**
     * 跳过错误处理
     * @default false
     */
    skipErrorHandler?: boolean
  }
}
