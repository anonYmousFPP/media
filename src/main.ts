import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Media API')
  .setDescription('API for managing media uploads and retrieval')
  .setVersion('1.0')
  .addTag('media')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3000);
  console.log(`HTTP server running on http://localhost:3000`);
  console.log(`gRPC server running on localhost:5000`);
}
bootstrap();