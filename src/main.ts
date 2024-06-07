import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerDocument } from './api/doc/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const swagger = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup('/', app, swagger);
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
