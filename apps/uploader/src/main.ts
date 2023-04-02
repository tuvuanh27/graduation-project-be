import { NestFactory } from '@nestjs/core';
import { UploaderModule } from './uploader.module';
import { KafkaServer } from '@libs/kafka/kafka.server';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UploaderModule);
  const kafkaServer = await app.resolve(KafkaServer);
  app.connectMicroservice<MicroserviceOptions>({
    strategy: kafkaServer,
  });
  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
