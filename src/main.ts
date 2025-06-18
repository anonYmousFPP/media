import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './docs/config.swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  await app.startAllMicroservices();
  app.enableCors();

  const port = configService.get<number>('PORT') || 3000;
  const grpcPort = configService.get<number>('GRPC_PORT') || 5000;

  await app.listen(port);
  console.log(`HTTP server running on http://localhost:${port}`);
  console.log(`gRPC server running on localhost:${grpcPort}`);
}
bootstrap();