import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { NftAttributes } from '@libs/database/entities';

export class CreatePendingNftDto {
  @ApiProperty({ example: 'This is NFT name' })
  @IsString()
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty({ example: 1 })
  @Expose({ name: 'is_public' })
  // 0 or 1
  @IsIn([0, 1])
  isPublic: number;

  @ApiProperty({ example: 'This is NFT description' })
  @IsString()
  @Expose({ name: 'description' })
  description: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'external_url' })
  externalUrl?: string;

  @ApiPropertyOptional({ type: [NftAttributes] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Expose({ name: 'attributes' })
  @Type(() => NftAttributes)
  attributes?: NftAttributes[];
}
