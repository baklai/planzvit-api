import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { PlanzvitLogger } from './common/services/logger.service';

const SWAGGER_API_TITLE = 'API Planzvit';
const SWAGGER_API_DESCRIPTION = 'API Програмно-технологічного супровіду';
const SWAGGER_API_VERSION = '1.0';
const SWAGGER_API_PATH = '/api';

const GLOBAL_PREFIX = '/api/';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: false,
    logger: ['log', 'error', 'warn']
  });

  const configService = app.get(ConfigService);

  const planzvitLogger = new PlanzvitLogger('PLANZVIT');

  app.useLogger(planzvitLogger);

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: false }));

  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      },
      stopAtFirstError: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API_TITLE)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT Guard',
        description: 'Введіть JWT Bearer токен',
        in: 'header'
      },
      'JWT Guard'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_API_PATH, app, document);

  const port = configService.get<number>('PORT');
  const host = configService.get<string>('HOST');

  await app.listen(port, host, async () => {
    console.info(`Application is running on: ${await app.getUrl()}/api`);
  });
}
bootstrap();
