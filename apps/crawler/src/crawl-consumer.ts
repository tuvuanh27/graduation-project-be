import { BaseConsumer, CRAWLER_QUEUE } from '@libs/queue';
import { Process, Processor } from '@nestjs/bull';
import { CrawlerService } from './crawler.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@libs/shared';
import { ModuleRef } from '@nestjs/core';
import { Job } from 'bull';
import { IQueueCrawl, NftEvent } from './types';
import { ChangeTokenPublic, TokenMinted, Transfer } from '@assets/abi/NftAbi';

@Processor(CRAWLER_QUEUE)
export class CrawlConsumer extends BaseConsumer {
  constructor(
    private readonly crawlerService: CrawlerService,
    protected readonly configService: ConfigService,
    protected readonly loggerService: LoggerService,
    protected readonly moduleRef: ModuleRef,
  ) {
    super(moduleRef, configService, loggerService);
  }

  getQueueName(): string {
    return CRAWLER_QUEUE;
  }

  @Process({ concurrency: 1 })
  async crawl(job: Job<IQueueCrawl>) {
    const { fromBlock, toBlock } = job.data;
    const events = await this.crawlerService.getAllEvents(fromBlock, toBlock);
    this.logger.log(
      `Crawl ${events.length} events from ${fromBlock} to ${toBlock} block`,
    );
    for (const event of events) {
      switch (event.event) {
        case NftEvent.Transfer:
          await this.crawlerService.handleTransferNft(
            event as unknown as Transfer,
          );
          break;
        case NftEvent.TokenMinted:
          await this.crawlerService.handleMintNft(
            event as unknown as TokenMinted,
          );
          break;
        case NftEvent.ChangeTokenPublic:
          await this.crawlerService.handleChangePublicNft(
            event as unknown as ChangeTokenPublic,
          );
          break;

        default:
          break;
      }
    }
  }
}
