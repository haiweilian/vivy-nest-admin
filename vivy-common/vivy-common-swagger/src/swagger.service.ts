import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { SwaggerOptions } from './swagger.interface'

export class SwaggerService {
  builder: DocumentBuilder

  constructor(
    private app: INestApplication,
    private options: SwaggerOptions = {}
  ) {
    this.builder = new DocumentBuilder()
  }

  setup() {
    const { enabled } = this.options
    if (enabled === false) return

    this.builderBase()
    this.builderAuth()

    const document = SwaggerModule.createDocument(this.app, this.builder.build())
    SwaggerModule.setup('swagger', this.app, document, {
      // https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
      swaggerOptions: {
        persistAuthorization: true,
      },
    })

    return this.builder
  }

  private builderBase() {
    const builder = this.builder
    const options = this.options

    if (options.title) {
      builder.setTitle(options.title)
    }

    if (options.description) {
      builder.setDescription(options.description)
    }

    if (options.version) {
      builder.setVersion(options.version)
    }

    if (options.termsOfService) {
      builder.setTermsOfService(options.termsOfService)
    }

    if (options.license) {
      builder.setLicense(options.license.name, options.license.url)
    }

    if (options.contact) {
      builder.setContact(options.contact.name, options.contact.url, options.contact.email)
    }

    if (options.externalDoc) {
      builder.setExternalDoc(options.externalDoc.description, options.externalDoc.url)
    }
  }

  private builderAuth() {
    const builder = this.builder

    builder.addBearerAuth()
  }
}
