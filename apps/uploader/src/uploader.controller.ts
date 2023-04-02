import { Controller } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { MessagePattern } from '@nestjs/microservices';
import { KafkaPayload } from '@libs/kafka';

@Controller()
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @MessagePattern('test')
  testGetMessageKafka(metadata: KafkaPayload<any>): string {
    return this.uploaderService.getHello(metadata);
  }
}
