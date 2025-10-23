import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  await app.listen(port);
}
bootstrap();
