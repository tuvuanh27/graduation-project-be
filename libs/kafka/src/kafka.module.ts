import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaClient } from './kafka.client';
import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { getKafkaClientOptions } from './kafka.config';
import { EEnvKey } from '@libs/configs/env.constant';

@Module({
  imports: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {
  static register(): DynamicModule {
    return {
      module: KafkaModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: KafkaClient,
          useFactory: (configService: ConfigService) => {
            const _groupId =
              configService.get<string>(EEnvKey.NODE_ENV) +
              '_' +
              EEnvKey.KAFKA_GROUP_ID;
            const uri = configService.get<string>(EEnvKey.KAFKA_URI);
            return new KafkaClient(
              getKafkaClientOptions(_groupId, EEnvKey.KAFKA_GROUP_ID, [
                uri,
              ]).options,
            );
          },
          inject: [ConfigService],
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }
}
