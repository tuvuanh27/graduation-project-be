import { Injectable } from '@nestjs/common';
import { ClientKafka, KafkaOptions } from '@nestjs/microservices';
import {
  Consumer,
  Producer,
} from '@nestjs/microservices/external/kafka.interface';

@Injectable()
export class KafkaClient extends ClientKafka {
  constructor(options: KafkaOptions['options']) {
    super(options);
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
