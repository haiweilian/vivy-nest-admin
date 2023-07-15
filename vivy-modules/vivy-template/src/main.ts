import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@vivy-common/config'
import { LoggerService } from '@vivy-common/logger'
import { SwaggerService } from '@vivy-common/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const name = config.get<string>('app.name')
  const port = config.get<number>('app.port')

  app.useLogger(app.get(LoggerService))

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
