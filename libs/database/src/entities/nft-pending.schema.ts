import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseDocument, BaseSchema, Prop } from '@libs/shared';
import { NFTMetadata } from '@libs/database/entities/nft.schema';

export type NftPendingDocument = NftPending & BaseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
  virtuals: true,
})
export class NftPending extends BaseSchema {
  @Prop({ required: false, type: String })
  uri: string;

  @Prop({ required: true, type: Boolean })
  isPublic: boolean;

  @Prop({ required: true, type: String })
  owner: string;

  @Prop({ required: false, type: NFTMetadata })
  metadata: NFTMetadata;

  @Prop({ required: false, type: String })
  ipfsHash: string;

  @Prop({ required: true, default: false, type: Boolean })
  isUploaded: boolean;

  @Prop({ required: false, type: String })
  nftId: string;
}

export const NftPendingSchemaInstance =
  SchemaFactory.createForClass(NftPending);
