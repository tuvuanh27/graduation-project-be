import { Controller } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { MessagePattern } from '@nestjs/microservices';
import { KafkaTopic } from '@libs/kafka/constants';
import { IKafkaPayload, PendingNftKafkaPayload } from '@libs/kafka/types';

@Controller()
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @MessagePattern(KafkaTopic.TOPIC_TEST)
  testGetMessageKafka(metadata: any): string {
    return this.uploaderService.getHello(metadata);
  }

  @MessagePattern(KafkaTopic.PENDING_NFT)
  uploadIpfs(payload: IKafkaPayload<PendingNftKafkaPayload>) {
    return this.uploaderService.handleMint(payload);
  }
}
