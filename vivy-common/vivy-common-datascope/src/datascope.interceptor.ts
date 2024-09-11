import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { DATA_SCOPE_SQL, DATA_SCOPE_METADATA } from './datascope.constants'
import { TableAlias } from './datascope.interface'
import { DataScopeService } from './datascope.service'

@Injectable()
export class DataScopeInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private dataScopeService: DataScopeService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const alias: TableAlias = this.reflector.get(DATA_SCOPE_METADATA, context.getHandler())
    if (!alias) return next.handle()

    const request = context.switchToHttp().getRequest()
    request[DATA_SCOPE_SQL] = this.dataScopeService.sql(alias)
    return next.handle()
  }
}
