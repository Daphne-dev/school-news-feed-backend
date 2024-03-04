import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      cors: true,
    });

    app.use(helmet());

    const configService = app.get<ConfigService>(ConfigService);

    const servicePort = configService.getOrThrow<string>('SERVICE_PORT');
    const environment = configService.getOrThrow<string>('ENVIRONMENT');

    if (environment !== 'prod') {
      const options = new DocumentBuilder()
        .setTitle('Classting Backend API')
        .setDescription('클래스팅 백엔드 서비스')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'jwt',
            description: 'JWT',
            in: 'header',
          },
          'jwt',
        )
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'jwt',
            description: 'Refresh JWT',
            in: 'header',
          },
          'refresh-jwt',
        )
        .build();
      const document = SwaggerModule.createDocument(app, options);
      SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Classting Backend API',
      });
    }

    await app.listen(servicePort);
  } catch (error) {
    Logger.error(`Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}
bootstrap();
