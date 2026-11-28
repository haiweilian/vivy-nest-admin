import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@vivy-common/config'
import { NestLogger } from '@vivy-common/logger'
import { SwaggerService } from '@vivy-common/swagger'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
    // 完全重复的路由在启动期直接报错
    routeConflictPolicy: { duplicate: 'error' },
    // 关闭期对新请求返回 503，在途请求继续完成
    return503OnClosing: true,
  })

  const config = app.get(ConfigService)
  const name = config.get<string>('app.name')
  const port = config.get<number>('app.port')

  app.useLogger(app.get(NestLogger))
  app.useBodyParser('json', { limit: '10mb' })
  app.enableShutdownHooks()
  app.useStaticAssets(config.get('upload.path'), { prefix: config.get('upload.prefix') })

  const swagger = new SwaggerService(app, config.get('swagger'))
  swagger.setup()

  await app.listen(port, () => {
    console.log(`
${name} run at \x1B[4m\x1B[34mhttp://localhost:${port}\x1B[0m
${name} swagger at \x1B[4m\x1B[34mhttp://localhost:${port}/swagger\x1B[0m
`)
  })
}
bootstrap()
