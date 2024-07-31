import { FactoryProvider } from '@nestjs/common'
import { JwtModuleOptions } from '@nestjs/jwt'

export interface SecurityOptions {
  jwt?: JwtModuleOptions
}

export interface SecurityAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<SecurityOptions> | SecurityOptions
  inject?: FactoryProvider['inject']
}
