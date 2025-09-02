import type { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

export type resultType = {
  accessToken?: string
}

export type RequestMethods = Extract<Method, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'>

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void
  beforeResponseCallback?: (response: PureHttpResponse) => void

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

export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T>
  post<T, P>(url: string, params?: P, config?: PureHttpRequestConfig): Promise<T>
  get<T, P>(url: string, params?: P, config?: PureHttpRequestConfig): Promise<T>
}
