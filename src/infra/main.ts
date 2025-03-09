import { patchNestjsSwagger } from '@anatine/zod-nestjs'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Diet Check API')
    .setDescription(
      'Node.js-based app designed to help users track and manage their dietary habits by logging meals'
    )
    .setVersion('1.0')
    .build()
  patchNestjsSwagger()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)

  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  await app.listen(port)
}
bootstrap()
