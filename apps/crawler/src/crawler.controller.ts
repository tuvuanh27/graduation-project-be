import { Controller, Get } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller()
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('/current-block-number')
  getCurrentBlockNumber(): Promise<number> {
    return this.crawlerService.getCurrentBlockNumber();
  }
}
