import { Injectable } from '@nestjs/common';
import { KafkaOptions } from '@nestjs/microservices';
import { Consumer } from '@nestjs/microservices/external/kafka.interface';
import { ServerKafka } from '@nestjs/microservices/server';

@Injectable()
export class KafkaServer extends ServerKafka {
  constructor(options: KafkaOptions['options']) {
    super(options);
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
