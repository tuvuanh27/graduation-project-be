import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseDocument, BaseSchema, Prop } from '@libs/shared';

export type NftDocument = Nft & BaseDocument;

export class NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
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

export const NftSchemaInstance = SchemaFactory.createForClass(Nft);
