import { Module } from '@nestjs/common';
import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';
import { ConfigurationModule, DatabaseModule } from '@libs/configs';
import { LoggingModule } from '@libs/shared';
import { KafkaServer } from '@libs/kafka/kafka.server';
import { EEnvKey } from '@libs/configs/env.constant';
import { getKafkaServerOptions } from '@libs/kafka/kafka.config';
import { ConfigService } from '@nestjs/config';
import { IpfsLibModule } from '@libs/ipfs-lib';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NftPending,
  NftPendingSchemaInstance,
} from '@libs/database/entities/nft-pending.schema';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    LoggingModule,
    IpfsLibModule.register({}, true),
    MongooseModule.forFeature([
      {
        name: NftPending.name,
        schema: NftPendingSchemaInstance,
      },
    ]),
  ],
  controllers: [UploaderController],
  providers: [
    UploaderService,
    NftPendingRepository,
    {
      provide: KafkaServer,
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>(EEnvKey.KAFKA_URI);
        return new KafkaServer(
          getKafkaServerOptions(
            EEnvKey.KAFKA_GROUP_ID,
            EEnvKey.KAFKA_CLIENT_ID,
            [uri],
          ).options,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [KafkaServer],
})
export class UploaderModule {}
