import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from '@vivy-common/security'
import { AppService } from './app.service'

@ApiTags('首页')
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello()
  }
}
