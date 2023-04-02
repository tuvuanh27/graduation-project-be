import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '@libs/kafka';
import { LoggerService } from '@libs/shared';
import { Web3Service } from '@libs/web3';
import Web3 from 'web3';

@Injectable()
export class NftService implements OnModuleInit {
  private web3: Web3;
  constructor(
    private readonly kafkaService: KafkaService,
    private loggerService: LoggerService,
    private web3Service: Web3Service,
  ) {}
  private readonly logger = this.loggerService.getLogger(NftService.name);

  async onModuleInit() {
    this.logger.log('NftService initialized');
    this.web3 = this.web3Service.getClient();
  }

  async testKafka(): Promise<void> {
    await this.kafkaService.send('test', {
      data: 'test',
      createdAt: Date.now(),
    });
    this.logger.log('test kafka');
    return;
  }
}
