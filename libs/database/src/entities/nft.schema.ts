import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseDocument, BaseSchema, Prop } from '@libs/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export type NftDocument = Nft & BaseDocument;

export class NftAttributes {
  @ApiPropertyOptional({ example: 'color' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'trait_type' })
  traitType?: string;

  @ApiPropertyOptional({ example: 'red' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'value' })
  value?: string;
}

export class NFTMetadata {
  @ApiProperty({ example: 'This is NFT name' })
  @IsString()
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty({ example: 'This is NFT description' })
  @IsString()
  @Expose({ name: 'description' })
  description: string;

  @ApiPropertyOptional({ example: 'https://ipfs.io/ipfs/tuvuanh27' })
  @IsString()
  @Expose({ name: 'image' })
  image: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsString()
  @IsOptional()
  @Expose({ name: 'external_url' })
  externalUrl?: string;

  @ApiPropertyOptional({ type: [NftAttributes] })
  @IsOptional()
  @Type(() => NftAttributes)
  @ValidateNested({ each: true })
  @Expose({ name: 'attributes' })
  attributes?: NftAttributes[];
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
  virtuals: true,
})
export class Nft extends BaseSchema {
  @Prop({ required: true, unique: true, type: String })
  tokenId: string;

  @Prop({ required: true, type: String })
  uri: string;

  @Prop({ required: true, type: String })
  contractAddress: string;

  @Prop({ required: true, type: Boolean })
  isPublic: boolean;

  @Prop({ required: false, default: [], type: [String] })
  viewers: string[];

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ required: true, type: String })
  owner: string;

  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: false, type: NFTMetadata })
  metadata: NFTMetadata;

  @Prop({ required: true, type: Number })
  blockNumberCreated: number;

  @Prop({ required: true, type: Number })
  blockTimeCreated: number;
}

const NftSchemaInstance = SchemaFactory.createForClass(Nft);

NftSchemaInstance.index({
  name: 'text',
  description: 'text',
  'metadata.name': 'text',
  'metadata.description': 'text',
});

export { NftSchemaInstance };
