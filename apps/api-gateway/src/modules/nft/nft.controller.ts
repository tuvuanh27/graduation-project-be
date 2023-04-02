import { Controller, Get } from '@libs/shared';
import { NftService } from '@app/modules/nft/nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('', {
    summary: 'test kafka',
  })
  async testKafka() {
    return await this.nftService.testKafka();
  }

  async uploadNft() {}
}
