import { NestFactory } from '@nestjs/core';
import { IpfsModule } from './ipfs.module';

async function bootstrap() {
  const app = await NestFactory.create(IpfsModule);
  await app.listen(3000);
}
bootstrap();
