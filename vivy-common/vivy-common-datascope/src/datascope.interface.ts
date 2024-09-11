import { FactoryProvider } from '@nestjs/common'

export interface TableAlias {
  /**
   * 部门表别名
   */
  deptAlias: string

  /**
   * 用户表别名
   */
  userAlias?: string
}

export interface DataScopeOptions {
  _?: unknown
}

export interface DataScopeAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<DataScopeOptions> | DataScopeOptions
  inject?: FactoryProvider['inject']
}
