import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class NftAttributes {
  @ApiPropertyOptional({ example: 'color' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'trait_type' })
  traitType?: string;

  @ApiPropertyOptional({ example: 'red' })
  @IsString()
  @IsOptional()
  value?: string;
}

export class CreatePendingNftDto {
  @ApiProperty({ example: 'This is NFT name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is NFT description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'external_url' })
  externalUrl?: string;

  @ApiPropertyOptional({ type: [NftAttributes] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NftAttributes)
  attributes?: NftAttributes[];
}
