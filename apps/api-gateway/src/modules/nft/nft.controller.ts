import {
  AddressRequireGuard,
  Controller,
  CurrentAddress,
  Get,
  Put,
  Post,
  Delete,
} from '@libs/shared';
import { NftService } from '@app/modules/nft/nft.service';
import { CreatePendingNftDto } from '@app/modules/nft/dtos/create-pending-nft.dto';
import {
  Body,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { ListNftIdDto } from '@app/modules/nft/dtos/list-nft-id.dto';
import { UpdatePendingNftDto } from '@app/modules/nft/dtos/update-pending-nft.dto';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('test-kafka')
  async testKafka() {
    return await this.nftService.testKafka();
  }

  @Post('/get-list-nft-onchain', {
    description: 'Get list nft onchain by nftId[]',
  })
  @UseGuards(AddressRequireGuard)
  async listNfts(
    @Body() data: ListNftIdDto,
    @CurrentAddress() address: string,
  ) {
    return await this.nftService.getListNft(data.nftIds, address);
  }

  @Get('/get-nft-onchain-by-owner', {
    description: 'Get list nft onchain of owner address',
  })
  @UseGuards(AddressRequireGuard)
  async getNftByOwner(@CurrentAddress() address: string) {
    return await this.nftService.getNftsByOwner(address);
  }

  @Get('/public-nft', {
    description: 'Get list public nft onchain, to display on home page',
  })
  async getPublicNft() {
    return await this.nftService.getPublicNft();
  }

  @Post('/create-pending', {
    description: 'Create pending nft',
  })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AddressRequireGuard)
  async uploadNft(
    @Body() body: CreatePendingNftDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentAddress() address: string,
  ) {
    return await this.nftService.createPending(body, file, address);
  }

  @Post('/upload-metadata-to-ipfs/:pendingId', {
    description:
      'Upload metadata to ipfs, then update ipfs hash to pending nft',
  })
  async uploadMetadataToIpfs(@Param('pendingId') pendingId: string) {
    return await this.nftService.createNftOnChain(pendingId);
  }

  @Get('/get-pending-nft', {
    description: 'Get list pending nft of owner address',
  })
  @UseGuards(AddressRequireGuard)
  async getPendingNft(@CurrentAddress() address: string) {
    return await this.nftService.getListPendingNftByOwner(address);
  }

  @Put('/update-nft/:pendingId', {
    description: 'Update pending nft, also require owner address',
  })
  @UseGuards(AddressRequireGuard)
  async updateNft(
    @Param('pendingId') pendingId: string,
    @Body() body: UpdatePendingNftDto,
    @CurrentAddress() address: string,
  ) {
    return await this.nftService.updateNft(pendingId, body, address);
  }

  @Post('search-nft-onchain', {
    description: 'Search nft onchain by name or description',
  })
  async searchNftOnchain(@Body() q: string) {
    return await this.nftService.searchNftOnchain(q);
  }

  @Delete('/delete-pending-nft/:pendingId', {
    description: 'Delete pending nft, also require owner address',
  })
  @UseGuards(AddressRequireGuard)
  async deletePendingNft(
    @Param('pendingId') pendingId: string,
    @CurrentAddress() address: string,
  ) {
    return await this.nftService.deletePendingNft(pendingId, address);
  }
}
