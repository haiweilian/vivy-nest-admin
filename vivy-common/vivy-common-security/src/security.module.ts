import { DynamicModule, Global, Module, Provider } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './guards/auth.guard.js'
import { InnerAuthGuard } from './guards/inner-auth.guard.js'
import { RequireAuthGuard } from './guards/require-auth.guard.js'
import { SecurityAsyncOptions, SecurityOptions } from './interfaces/security-options.interface.js'
import { SECURITY_OPTIONS } from './security.constants.js'
import { AuthService } from './services/auth.service.js'
import { TokenService } from './services/token.service.js'

@Global()
@Module({})
export class SecurityModule {
  static forRoot(options?: SecurityOptions): DynamicModule {
    return this.register({
      useFactory: () => options || {},
    })
  }

  static forRootAsync(options: SecurityAsyncOptions): DynamicModule {
    return this.register(options)
  }

  private static register(options: SecurityAsyncOptions) {
    const OptionsProvider: Provider = {
      provide: SECURITY_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: SecurityModule,
      imports: [
        JwtModule.registerAsync({
          async useFactory(...args: any) {
            const options: SecurityOptions = await OptionsProvider.useFactory(...args)
            return {
              global: true,
              ...options.jwt,
            }
          },
          inject: OptionsProvider.inject,
        }),
      ],
      providers: [
        OptionsProvider,
        AuthService,
        TokenService,
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
      exports: [AuthService, TokenService],
    }
  }
}
