import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(
    ['/api/docs', '/api/docs-json'],
    basicAuth({
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS },
      challenge: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Match Movie')
    .setDescription('Documentação da API do Match Movie')
    .addTag('auth')
    .addTag('users')
    .addTag('groups')
    .addTag('movies')
    .addTag('favorites')
    .addTag('watched')
    .addTag('geolocation')
    .addTag('ingresso')
    .addTag('match')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();