import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@vivy-common/config'
import { NestLogger } from '@vivy-common/logger'
import { SwaggerService } from '@vivy-common/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })

  const config = app.get(ConfigService)
  const name = config.get<string>('app.name')
  const port = config.get<number>('app.port')

  app.useLogger(app.get(NestLogger))
  app.useStaticAssets(config.get('upload.file.path'), { prefix: config.get('upload.file.prefix') })

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
