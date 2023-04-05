import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListNftIdDto {
  @ApiProperty({ type: [String], example: ['1', '2', '3'] })
  @IsArray()
  @IsString({ each: true })
  nftIds: string[];
}
