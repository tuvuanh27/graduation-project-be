import { lastValueFrom } from 'rxjs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient } from './kafka.client';
import { IKafkaPayload } from '@libs/kafka/types';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(private kafka: KafkaClient) {}

  /**
   * connect kafka when init
   */
  async onModuleInit(): Promise<void> {
    await this.kafka.connect();
  }

  /**
   * send message to kafka
   * @param topic
   * @param message
   * @returns
   */
  send<T>(topic: string, message: IKafkaPayload<T>) {
    return lastValueFrom(this.kafka.emit(topic, message));
  }

  getProducer() {
    return this.kafka.getProducer();
  }

  getConsumer() {
    return this.kafka.getConsumer();
  }
}
