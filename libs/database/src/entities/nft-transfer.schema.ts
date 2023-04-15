import { Schema, SchemaFactory } from '@nestjs/mongoose';

import { BaseDocument, BaseSchema, Prop } from '@libs/shared';

export type NftTransferDocument = NftTransfer & BaseDocument;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
  virtuals: true,
})
export class NftTransfer extends BaseSchema {
  @Prop({ required: true, type: String })
  tokenId: string;

  @Prop({ required: true, type: String })
  txHash: string;

  @Prop({ required: true, type: String })
  contractAddress: string;

  @Prop({ required: true, type: String })
  from: string;

  @Prop({ required: true, type: String })
  to: string;

  @Prop({ required: true, type: Number })
  blockNumber: number;

  @Prop({ required: true, type: Number })
  blockTime: number;
}

export const NftTransferSchemaInstance =
  SchemaFactory.createForClass(NftTransfer);
