import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { NFTMetadata } from '@libs/database/entities';
import { Type } from 'class-transformer';

export class UpdatePendingNftDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({ type: NFTMetadata })
  @Type(() => NFTMetadata)
  @IsOptional()
  metadata?: NFTMetadata;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isUploaded?: boolean;
}
