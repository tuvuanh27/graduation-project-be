import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { Web3Module } from '@libs/web3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EEnvKey } from '@libs/configs/env.constant';
import { ConfigurationModule, DatabaseModule } from '@libs/configs';
import { LoggingModule } from '@libs/shared';
import { ConsoleModule } from 'nestjs-console';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { memoryStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LatestBlock,
  LatestBlockSchemaInstance,
  Nft,
  NftSchemaInstance,
  NftTransfer,
  NftTransferSchemaInstance,
} from '@libs/database/entities';
import { LatestBlockRepository } from '@libs/database/repositories/latest-block.repository';
import { QueueModule } from '@libs/queue';
import { CrawlConsumer } from './crawl-consumer';
import { NftTransferRepository } from '@libs/database/repositories/nft-transfer.repository';
import { NftRepository } from '@libs/database/repositories/nft.repository';
import { RedisModule } from '@libs/redis';
import { CRAWLER_CACHE } from '@libs/redis/constants';
import {
  NftPending,
  NftPendingSchemaInstance,
} from '@libs/database/entities/nft-pending.schema';
import { NftPendingRepository } from '@libs/database/repositories/nft-pending.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    Web3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>(EEnvKey.RPC_BSC_TESTNET_URL),
      }),
      inject: [ConfigService],
    }),
    ConfigurationModule,
    DatabaseModule,
    LoggingModule,
    ConsoleModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: LatestBlock.name, schema: LatestBlockSchemaInstance },
      { name: NftTransfer.name, schema: NftTransferSchemaInstance },
      { name: Nft.name, schema: NftSchemaInstance },
      { name: NftPending.name, schema: NftPendingSchemaInstance },
    ]),
    RedisModule.registerAsync(CRAWLER_CACHE),
    QueueModule,
    HttpModule.register({
      timeout: 180000, // 3 minutes
      maxRedirects: 5,
    }),
  ],
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    LatestBlockRepository,
    NftTransferRepository,
    NftRepository,
    NftPendingRepository,
    CrawlConsumer,
  ],
})
export class CrawlerModule {}
