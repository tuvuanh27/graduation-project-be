import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CrawlerModule,
    {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    },
  );
  await app.listen();
}

void bootstrap();
