import { FactoryProvider } from '@nestjs/common'

export interface SecurityOptions {
  secret?: string
}

export interface SecurityAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<SecurityOptions> | SecurityOptions
  inject?: FactoryProvider['inject']
}
