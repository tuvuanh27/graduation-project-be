import { Controller, Get } from '@libs/shared';
import { NftService } from '@app/modules/nft/nft.service';
import { CreatePendingNftDto } from '@app/modules/nft/dtos/create-pending-nft.dto';
import { Body, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('test-kafka')
  async testKafka(@Body() body: CreatePendingNftDto) {
    return await this.nftService.testKafka(body);
  }

  @Post('pending')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @UseInterceptors(FileInterceptor('file'))
  async uploadNft(
    @Body() body: CreatePendingNftDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.nftService.uploadNft(body, file);
  }
}
