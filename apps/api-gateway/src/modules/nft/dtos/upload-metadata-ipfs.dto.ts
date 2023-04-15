import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadMetadataIpfsDto {
  @ApiProperty()
  @IsString()
  nftId: string;
}
