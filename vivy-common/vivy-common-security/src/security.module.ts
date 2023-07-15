import { DynamicModule, Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { TokenConstants } from '@vivy-common/core'
import { AuthGuard } from './guards/auth.guard'
import { InnerAuthGuard } from './guards/inner-auth.guard'
import { RequireAuthGuard } from './guards/require-auth.guard'
import { SecurityOptions } from './interfaces/security-options.interface'
import { AuthUtils } from './utils/auth.utils'
import { TokenUtils } from './utils/token.utils'

@Global()
@Module({})
export class SecurityModule {
  static forRoot(options?: SecurityOptions): DynamicModule {
    return this.register(options || {})
  }

  private static register(options: SecurityOptions) {
    return {
      module: SecurityModule,
      imports: [
        JwtModule.registerAsync({
          useFactory() {
            return {
              global: true,
              secret: options?.secret || TokenConstants.SECRET,
            }
          },
        }),
      ],
      providers: [
        AuthUtils,
        TokenUtils,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: InnerAuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RequireAuthGuard,
        },
      ],
      exports: [AuthUtils, TokenUtils],
    }
  }
}
