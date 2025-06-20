import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4200/',
      methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('API for managing notes')
    .setVersion('1.0')
    .addTag('notes')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on http://localhost:3000');
  console.log('Swagger documentation available at http://localhost:3000/api');
}
bootstrap();
