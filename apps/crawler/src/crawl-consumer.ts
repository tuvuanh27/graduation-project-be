import { BaseConsumer, CRAWLER_QUEUE } from '@libs/queue';
import { Process, Processor } from '@nestjs/bull';
import { CrawlerService } from './crawler.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@libs/shared';
import { ModuleRef } from '@nestjs/core';
import { Job } from 'bull';
import { IQueueCrawl, NftEvent } from './types';
import {
  AddViewer,
  BuyToken,
  ChangeTokenPublic,
  RemoveViewer,
  SaleToken,
  TokenMinted,
  Transfer,
} from '@assets/abi/NftAbi';

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
    this.logger.debug(
      `[Crawl] Detect ${events.length} events from ${fromBlock} to ${toBlock} block`,
    );
    this.logger.debug(`[Crawl] Events: ${JSON.stringify(events)} `);
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

        case NftEvent.AddViewer:
          await this.crawlerService.handleAddViewer(
            event as unknown as AddViewer,
          );
          break;

        case NftEvent.RemoveViewer:
          await this.crawlerService.handleRemoveViewer(
            event as unknown as RemoveViewer,
          );
          break;

        case NftEvent.SaleToken:
          await this.crawlerService.handleSaleNft(
            event as unknown as SaleToken,
          );
          break;

        case NftEvent.BuyToken:
          await this.crawlerService.handleBuyNft(event as unknown as BuyToken);
          break;

        default:
          break;
      }
    }
  }
}
